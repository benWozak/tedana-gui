use regex::Regex;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord, Clone, Copy)]
pub struct EchoNum(u8);

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BoldMetadata {
    pub echo_num: EchoNum,
    pub delay_time: Option<f64>,
    pub echo_time: Option<f64>,
    pub repetition_time: Option<f64>,
    pub skull_stripped: Option<bool>,
    pub slice_timing_corrected: Option<bool>,
    pub start_time: Option<f64>,
    pub task_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Session {
    pub sub_id: usize,
    pub name: String,
    pub echo_nifti_file_paths: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Subject {
    pub id: usize,
    pub name: String,
    pub sessions: Vec<Session>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BidsStructure {
    pub metadata: Vec<BoldMetadata>,
    pub subjects: Vec<Subject>,
}

pub fn validate_bids_directory(path: String) -> Result<String, String> {
    let dir_path = Path::new(&path);
    if !dir_path.is_dir() {
        return Err("The provided path is not a directory".to_string());
    }

    // Check for sub-* directories
    let sub_dirs: Vec<_> = fs::read_dir(dir_path)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let file_name = entry.file_name().to_string_lossy().into_owned();
            if file_name.starts_with("sub-") && entry.file_type().ok()?.is_dir() {
                Some(entry.path())
            } else {
                None
            }
        })
        .collect();

    if sub_dirs.is_empty() {
        return Err("No sub-* directories found".to_string());
    }

    for sub_dir in sub_dirs {
        validate_subject_directory(&sub_dir)?;
    }

    Ok("This directory is BIDS-compatible".to_string())
}

fn validate_subject_directory(sub_dir: &Path) -> Result<(), String> {
    let ses_dirs: Vec<_> = fs::read_dir(sub_dir)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let file_name = entry.file_name().to_string_lossy().into_owned();
            if file_name.starts_with("ses-") && entry.file_type().ok()?.is_dir() {
                Some(entry.path())
            } else {
                None
            }
        })
        .collect();

    if ses_dirs.is_empty() {
        // No ses- directories, check for func directly in sub- directory
        validate_func_directory(sub_dir)?;
    } else {
        // Check each ses- directory
        for ses_dir in ses_dirs {
            validate_func_directory(&ses_dir)?;
        }
    }

    Ok(())
}

fn validate_func_directory(dir: &Path) -> Result<(), String> {
    let func_dir = dir.join("func");
    if !func_dir.is_dir() {
        return Err(format!("No 'func' directory found in {:?}", dir));
    }

    let bold_files: Vec<_> = fs::read_dir(&func_dir)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let file_name = entry.file_name().to_string_lossy().into_owned();
            if file_name.ends_with("_bold.json")
                || file_name.ends_with("_bold.nii")
                || file_name.ends_with("_bold.nii.gz")
            {
                Some(file_name)
            } else {
                None
            }
        })
        .collect();

    if bold_files.is_empty() {
        return Err(format!(
            "No '_bold.json', '_bold.nii', or '_bold.nii.gz' files found in {:?}",
            func_dir
        ));
    }

    // Check if there's at least one .json file and one .nii or .nii.gz file
    let has_json = bold_files.iter().any(|f| f.ends_with("_bold.json"));
    let has_nii = bold_files
        .iter()
        .any(|f| f.ends_with("_bold.nii") || f.ends_with("_bold.nii.gz"));

    if !has_json || !has_nii {
        return Err(format!(
            "Missing required '_bold.json' or '_bold.nii'/'_bold.nii.gz' files in {:?}",
            func_dir
        ));
    }

    Ok(())
}

pub fn extract_bids_structure(dir_path: &str) -> Result<BidsStructure, String> {
    println!("Starting BIDS structure extraction from: {}", dir_path);
    let path = Path::new(dir_path);
    let mut structure = BidsStructure {
        metadata: Vec::new(),
        subjects: Vec::new(),
    };

    if !path.is_dir() {
        return Err(format!("Provided path is not a directory: {}", dir_path));
    }

    // Extract subjects
    let subject_dirs: Vec<_> = fs::read_dir(path)
        .map_err(|e| format!("Failed to read directory {}: {}", dir_path, e))?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let file_name = entry.file_name().to_string_lossy().into_owned();
            if file_name.starts_with("sub-") && entry.file_type().ok()?.is_dir() {
                Some(entry.path())
            } else {
                None
            }
        })
        .collect();

    println!("Found {} subject directories", subject_dirs.len());

    for (subject_id, subject_dir) in subject_dirs.iter().enumerate() {
        let subject_name = subject_dir
            .file_name()
            .unwrap()
            .to_string_lossy()
            .into_owned();
        let mut subject = Subject {
            id: subject_id,
            name: subject_name,
            sessions: Vec::new(),
        };

        let sessions = extract_sessions(subject_dir)?;

        for (session_id, session_name) in sessions.iter().enumerate() {
            let session_dir = if session_name.is_empty() {
                subject_dir.to_path_buf()
            } else {
                subject_dir.join(session_name)
            };

            let echo_nifti_file_paths = extract_echo_nifti_file_paths(&session_dir)?;

            let session = Session {
                sub_id: subject_id,
                name: session_name.clone(),
                echo_nifti_file_paths,
            };

            subject.sessions.push(session);

            // Extract metadata from the first subject's first session
            if structure.metadata.is_empty() && session_id == 0 {
                structure.metadata = extract_bold_metadata(&session_dir)?;
            }
        }

        structure.subjects.push(subject);
    }

    Ok(structure)
}

fn extract_sessions(subject_dir: &Path) -> Result<Vec<String>, String> {
    let session_dirs: Vec<_> = fs::read_dir(subject_dir)
        .map_err(|e| format!("Failed to read subject directory {:?}: {}", subject_dir, e))?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let file_name = entry.file_name().to_string_lossy().into_owned();
            if file_name.starts_with("ses-") && entry.file_type().ok()?.is_dir() {
                Some(file_name)
            } else {
                None
            }
        })
        .collect();

    if session_dirs.is_empty() {
        // If no session directories, assume a single unnamed session
        Ok(vec!["".to_string()])
    } else {
        Ok(session_dirs)
    }
}

fn extract_echo_nifti_file_paths(session_dir: &Path) -> Result<Vec<String>, String> {
    let func_dir = session_dir.join("func");
    let nifti_re = Regex::new(r"_echo-[1-5].*_bold\.(nii|nii\.gz)$").unwrap();

    let mut nifti_files = Vec::new();

    for entry in fs::read_dir(&func_dir)
        .map_err(|e| format!("Failed to read func directory {:?}: {}", func_dir, e))?
    {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let file_path = entry.path();
        let file_name = file_path.file_name().unwrap().to_string_lossy();

        if nifti_re.is_match(&file_name) {
            nifti_files.push(file_path.to_string_lossy().into_owned());
        }
    }

    nifti_files.sort();
    Ok(nifti_files)
}

fn extract_bold_metadata(session_dir: &Path) -> Result<Vec<BoldMetadata>, String> {
    println!("Extracting BOLD metadata from: {:?}", session_dir);
    let func_dir = session_dir.join("func");
    if !func_dir.is_dir() {
        return Err(format!("No 'func' directory found in {:?}", session_dir));
    }

    let json_re = Regex::new(r"_echo-[1-5].*_bold\.json$").unwrap();

    let mut json_files = Vec::new();

    for entry in fs::read_dir(&func_dir)
        .map_err(|e| format!("Failed to read func directory {:?}: {}", func_dir, e))?
    {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let file_path = entry.path();
        let file_name = file_path.file_name().unwrap().to_string_lossy();

        if json_re.is_match(&file_name) {
            json_files.push(file_path);
        }
    }

    println!("Found {} JSON files in func directory", json_files.len());

    let mut metadata_vec = Vec::new();
    for json_path in json_files {
        if let Ok(metadata) = extract_file_metadata(&json_path) {
            metadata_vec.push(metadata);
        }
    }

    println!("Extracted {} BOLD metadata entries", metadata_vec.len());
    metadata_vec.sort_by_key(|m| m.echo_num);
    metadata_vec.dedup_by_key(|m| m.echo_num);
    println!("After deduplication: {} unique entries", metadata_vec.len());

    Ok(metadata_vec)
}

fn extract_file_metadata(file_path: &PathBuf) -> Result<BoldMetadata, String> {
    let file_contents =
        fs::read_to_string(file_path).map_err(|e| format!("Failed to read file: {}", e))?;

    let json: Value =
        serde_json::from_str(&file_contents).map_err(|e| format!("Failed to parse JSON: {}", e))?;

    let re = Regex::new(r"echo-(\d+)").unwrap();
    let echo_num = re
        .captures(&file_path.to_string_lossy())
        .and_then(|cap| cap.get(1))
        .and_then(|m| m.as_str().parse::<u8>().ok())
        .ok_or_else(|| "Failed to extract echo number".to_string())?;

    Ok(BoldMetadata {
        echo_num: EchoNum(echo_num),
        delay_time: json["DelayTime"].as_f64(),
        echo_time: json["EchoTime"].as_f64(),
        repetition_time: json["RepetitionTime"].as_f64(),
        skull_stripped: json["SkullStripped"].as_bool(),
        slice_timing_corrected: json["SliceTimingCorrected"].as_bool(),
        start_time: json["StartTime"].as_f64(),
        task_name: json["TaskName"].as_str().map(String::from),
    })
}

// fn find_matching_nifti<'a>(json_path: &Path, nifti_files: &'a [PathBuf]) -> Option<&'a PathBuf> {
//     let json_stem = json_path.file_stem()?.to_str()?;

//     for nifti_path in nifti_files {
//         let nifti_stem = nifti_path.file_stem()?.to_str()?;
//         let nifti_stem = nifti_stem.trim_end_matches(".nii").trim_end_matches(".gz");

//         if json_stem == nifti_stem {
//             return Some(nifti_path);
//         }
//     }

//     None
// }
