use once_cell::sync::Lazy;
use std::path::Path;
use std::process::Command;
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
    window: &tauri::Window,
    python_path: &str,
    command_args: &str,
) -> Result<String, String> {
    let env_path = Path::new(python_path).parent().unwrap().parent().unwrap();

    // Step 1: Activate the virtual environment
    let activate_script = env_path.join("bin").join("activate");
    let activate_command = format!(". {}", activate_script.display());

    // Create a shell that sources the activate script
    let mut child = Command::new("bash")
        .arg("-c")
        .arg(&format!("{}; exec bash", activate_command))
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start shell: {}", e))?;

    // Step 2: Execute tedana in the activated environment
    let tedana_command = format!("tedana {}", command_args);

    println!("Executing command: {}", tedana_command);

    if let Some(mut stdin) = child.stdin.take() {
        use std::io::Write;
        writeln!(stdin, "{}", tedana_command)
            .map_err(|e| format!("Failed to write to stdin: {}", e))?;
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("Failed to wait on child: {}", e))?;

    // Process the output
    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(format!(
            "Error:\n{}",
            String::from_utf8_lossy(&output.stderr)
        ))
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
