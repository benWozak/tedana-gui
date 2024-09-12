use regex::Regex;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs;
use std::path::{Path, PathBuf};

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

pub fn extract_bold_metadata(dir_path: &str) -> Result<Vec<BoldMetadata>, String> {
    let path = Path::new(dir_path);
    let mut metadata_vec = Vec::new();

    // Check for sub-* directories
    let sub_dirs: Vec<_> = fs::read_dir(path)
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
        extract_from_subject_directory(&sub_dir, &mut metadata_vec)?;
    }

    if metadata_vec.is_empty() {
        Err("No matching BOLD JSON files found".to_string())
    } else {
        // Remove duplicates based on echo_num
        metadata_vec.sort_by_key(|m| m.echo_num);
        metadata_vec.dedup_by_key(|m| m.echo_num);
        Ok(metadata_vec)
    }
}

fn extract_from_subject_directory(
    sub_dir: &Path,
    metadata_vec: &mut Vec<BoldMetadata>,
) -> Result<(), String> {
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
        extract_from_func_directory(&sub_dir.join("func"), metadata_vec)?;
    } else {
        // Check each ses- directory
        for ses_dir in ses_dirs {
            extract_from_func_directory(&ses_dir.join("func"), metadata_vec)?;
        }
    }

    Ok(())
}

fn extract_from_func_directory(
    func_dir: &Path,
    metadata_vec: &mut Vec<BoldMetadata>,
) -> Result<(), String> {
    if !func_dir.is_dir() {
        return Err(format!(
            "No 'func' directory found in {:?}",
            func_dir.parent().unwrap()
        ));
    }

    let re = Regex::new(r"_echo-[1-5].*_bold\.json$").unwrap();

    for entry in fs::read_dir(func_dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let file_path = entry.path();
        if file_path.is_file() && re.is_match(&file_path.to_string_lossy()) {
            if let Ok(metadata) = extract_file_metadata(&file_path) {
                metadata_vec.push(metadata);
            }
        }
    }

    Ok(())
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
