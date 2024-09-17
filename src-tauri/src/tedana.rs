use std::io::{BufRead, BufReader};
use std::path::Path;
use std::process::{Command, Stdio};
use tauri::Window;
use tokio::sync::mpsc;

pub fn check_tedana_installation(python_path: String) -> Result<String, String> {
    let venv_dir = Path::new(&python_path).parent().unwrap().parent().unwrap();
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

pub async fn run_tedana(
    window: Window,
    python_path: String,
    command_args: String,
) -> Result<String, String> {
    println!("Received python_path: {}", python_path);
    println!("Received command_args: {}", command_args);

    let env_dir = Path::new(&python_path).parent().unwrap().parent().unwrap();
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

    let window_clone = window.clone();
    tokio::spawn(async move {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(line) = line {
                println!("STDOUT: {}", line);
                window_clone.emit("tedana-progress", &line).unwrap();
                tx.send(line).await.unwrap();
            }
        }
    });

    let window_clone = window.clone();
    tokio::spawn(async move {
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            if let Ok(line) = line {
                eprintln!("STDERR: {}", line);
                window_clone.emit("tedana-error", &line).unwrap();
            }
        }
    });

    let status = child
        .wait()
        .map_err(|e| format!("Failed to wait on child process: {}", e))?;

    let mut output = String::new();
    while let Some(line) = rx.recv().await {
        output.push_str(&line);
        output.push('\n');
    }

    if status.success() {
        Ok(output)
    } else {
        Err("Tedana process exited with an error".to_string())
    }
}
