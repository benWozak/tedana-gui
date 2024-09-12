use std::path::Path;
use std::process::Command;

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

pub fn run_tedana(python_path: String, args: Vec<String>) -> Result<String, String> {
    println!("Received python_path: {}", python_path);
    println!("Received args: {:?}", args);

    let venv_dir = Path::new(&python_path).parent().unwrap().parent().unwrap();
    let activate_script = venv_dir.join("bin").join("activate");
    let tedana_path = venv_dir.join("bin").join("tedana");

    let command_string = format!(
        "source {} && {} {}",
        activate_script.to_str().unwrap(),
        tedana_path.to_str().unwrap(),
        args.join(" ")
    );

    println!("Executing command: {}", command_string);

    let output = Command::new("sh")
        .arg("-c")
        .arg(&command_string)
        .output()
        .map_err(|e| {
            println!("Command execution error: {}", e);
            e.to_string()
        })?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout).to_string();
        println!("Command executed successfully. Output: {}", stdout);
        Ok(stdout)
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        println!("Command failed. Error: {}", stderr);
        Err(format!("Error: {}", stderr))
    }
}
