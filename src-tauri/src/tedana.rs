use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::{mpsc, Mutex};

static IS_RUNNING: Lazy<Mutex<bool>> = Lazy::new(|| Mutex::new(false));

#[tauri::command]
pub async fn run_tedana(
    window: tauri::Window,
    python_path: String,
    command_args: String,
    selected_subjects: Vec<String>,
    selected_sessions: HashMap<String, Vec<String>>,
) -> Result<String, String> {
    let mut is_running = IS_RUNNING.lock().await;
    if *is_running {
        return Err("Tedana is already running".to_string());
    }
    *is_running = true;

    let result = run_tedana_for_subjects(
        window,
        python_path,
        command_args,
        selected_subjects,
        selected_sessions,
    )
    .await;

    *is_running = false;
    result
}

async fn run_tedana_for_subjects(
    window: tauri::Window,
    python_path: String,
    command_args: String,
    selected_subjects: Vec<String>,
    selected_sessions: HashMap<String, Vec<String>>,
) -> Result<String, String> {
    let mut overall_output = String::new();

    for subject in selected_subjects {
        let sessions = selected_sessions
            .get(&subject)
            .ok_or_else(|| format!("No sessions found for subject {}", subject))?;
        for session in sessions {
            let subject_session_args = if session.is_empty() {
                format!("{} --subject {}", command_args, subject)
            } else {
                format!(
                    "{} --subject {} --session {}",
                    command_args, subject, session
                )
            };
            let result =
                run_tedana_internal(window.clone(), python_path.clone(), subject_session_args)
                    .await?;
            overall_output.push_str(&format!(
                "Subject: {}, Session: {}\n{}\n\n",
                subject, session, result
            ));
        }
    }

    Ok(overall_output)
}

async fn run_tedana_internal(
    window: tauri::Window,
    python_path: String,
    command_args: String,
) -> Result<String, String> {
    println!("Received python_path: {}", python_path);
    println!("Received command_args: {}", command_args);

    let env_dir = std::path::Path::new(&python_path)
        .parent()
        .unwrap()
        .parent()
        .unwrap();
    let activate_script = env_dir.join("bin").join("activate");
    let tedana_path = env_dir.join("bin").join("tedana");

    let full_command = format!(
        "source {} && {} {}",
        activate_script.display(),
        tedana_path.display(),
        command_args
    );

    println!("Executing command: {}", full_command);

    let mut child = Command::new("bash")
        .arg("-c")
        .arg(&full_command)
        .env(
            "PATH",
            format!(
                "{}:{}",
                env_dir.join("bin").display(),
                std::env::var("PATH").unwrap_or_default()
            ),
        )
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    let stdout = child.stdout.take().unwrap();
    let stderr = child.stderr.take().unwrap();

    let (tx, mut rx) = mpsc::channel(100);
    let output = Arc::new(Mutex::new(String::new()));

    let window_clone = window.clone();
    let output_clone = Arc::clone(&output);
    let tx_clone = tx.clone();
    tokio::spawn(async move {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(line) = line {
                println!("STDOUT: {}", line);
                window_clone.emit("tedana-progress", &line).unwrap();
                let mut output = output_clone.lock().await;
                output.push_str(&line);
                output.push('\n');
                tx_clone.send(()).await.unwrap();
            }
        }
    });

    let window_clone = window.clone();
    let output_clone = Arc::clone(&output);
    tokio::spawn(async move {
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            if let Ok(line) = line {
                eprintln!("STDERR: {}", line);
                window_clone.emit("tedana-error", &line).unwrap();
                let mut output = output_clone.lock().await;
                output.push_str("ERROR: ");
                output.push_str(&line);
                output.push('\n');
                tx.send(()).await.unwrap();
            }
        }
    });

    let child_arc = Arc::new(Mutex::new(child));

    loop {
        tokio::select! {
            _ = rx.recv() => {
                // New output received, continue waiting
            }
            status = tokio::task::spawn_blocking({
                let child = Arc::clone(&child_arc);
                move || child.blocking_lock().try_wait()
            }) => {
                match status {
                    Ok(Ok(Some(exit_status))) => {
                        let output = output.lock().await.clone();
                        if !exit_status.success() || output.contains("ERROR:") {
                            return Err(format!("Tedana process exited with an error. Output: {}", output));
                        }
                        return Ok(output);
                    }
                    Ok(Ok(None)) => {
                        // Process hasn't exited yet, continue waiting
                        tokio::time::sleep(Duration::from_millis(100)).await;
                    }
                    _ => return Err("Failed to wait on child process".to_string()),
                }
            }
        }
    }
}

#[tauri::command]
pub async fn kill_tedana() -> Result<(), String> {
    let mut is_running = IS_RUNNING.lock().await;
    if *is_running {
        *is_running = false;
        Ok(())
    } else {
        Err("No Tedana process is currently running".to_string())
    }
}

pub fn check_tedana_installation(python_path: String) -> Result<String, String> {
    let venv_dir = std::path::Path::new(&python_path)
        .parent()
        .unwrap()
        .parent()
        .unwrap();
    let activate_script = venv_dir.join("bin").join("activate");

    let command_string = format!(
        "source {} && {} -c \"import tedana; print(tedana.__version__)\"",
        activate_script.to_str().unwrap(),
        python_path
    );

    let output = Command::new("sh")
        .arg("-c")
        .arg(&command_string)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
    } else {
        Err(format!(
            "Error: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}
