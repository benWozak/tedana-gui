use once_cell::sync::Lazy;
use std::io::{BufRead, BufReader};
use std::path::Path;
use std::process::Command;
use tauri::Window;
use tokio::sync::Mutex;

static IS_RUNNING: Lazy<Mutex<bool>> = Lazy::new(|| Mutex::new(false));

pub async fn run_tedana(
    window: tauri::Window,
    python_path: String,
    command_args: String,
) -> Result<String, String> {
    let mut is_running = IS_RUNNING.lock().await;
    if *is_running {
        return Err("Tedana is already running".to_string());
    }
    *is_running = true;

    let result = run_tedana_internal(&window, &python_path, &command_args);

    *is_running = false;
    result
}

fn run_tedana_internal(
    window: &Window,
    python_path: &str,
    command_args: &str,
) -> Result<String, String> {
    let env_path = Path::new(python_path).parent().unwrap().parent().unwrap();
    let activate_script = env_path.join("bin").join("activate");
    let activate_command = format!(". {}", activate_script.display());
    let tedana_command = format!("tedana {}", command_args);

    let mut child = Command::new("bash")
        .arg("-c")
        .arg(&format!("{}; {}", activate_command, tedana_command))
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start process: {}", e))?;

    let stdout = child.stdout.take().unwrap();
    let stderr = child.stderr.take().unwrap();

    let window_clone = window.clone();
    std::thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(line) = line {
                window_clone.emit("tedana-output", line).unwrap();
            }
        }
    });

    let window_clone = window.clone();
    std::thread::spawn(move || {
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            if let Ok(line) = line {
                window_clone.emit("tedana-error", line).unwrap();
            }
        }
    });

    let status = child
        .wait()
        .map_err(|e| format!("Failed to wait on child: {}", e))?;

    if status.success() {
        Ok("Tedana execution completed successfully".to_string())
    } else {
        Err("Tedana execution failed".to_string())
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

pub fn check_tedana_installation(
    python_path: String,
    environment_path: Option<String>,
) -> Result<String, String> {
    let command_string = if let Some(env_path) = environment_path {
        let activate_script = Path::new(&env_path).join("bin").join("activate");
        format!(
            "source {} && {} -c \"import tedana; print(tedana.__version__)\"",
            activate_script.to_str().unwrap(),
            python_path
        )
    } else {
        format!(
            "{} -c \"import tedana; print(tedana.__version__)\"",
            python_path
        )
    };

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
