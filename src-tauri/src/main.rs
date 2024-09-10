// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dark_light::Mode;
use std::path::Path;
use std::process::Command;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tauri::Manager;

// get local system theme settings
#[tauri::command]
fn get_system_theme() -> String {
    match dark_light::detect() {
        Mode::Dark => "dim".to_string(),
        Mode::Light | Mode::Default => "emerald".to_string(),
    }
}

#[tauri::command]
async fn listen_system_theme_changes(app: tauri::AppHandle) {
    let running = Arc::new(AtomicBool::new(true));
    let running_clone = running.clone();

    std::thread::spawn(move || {
        let mut last_mode = dark_light::detect();
        while running_clone.load(Ordering::Relaxed) {
            std::thread::sleep(std::time::Duration::from_secs(1));
            let current_mode = dark_light::detect();
            if current_mode != last_mode {
                last_mode = current_mode;
                let theme = match current_mode {
                    Mode::Dark => "dark",
                    Mode::Light | Mode::Default => "light",
                };
                let _ = app.emit_all("system-theme-change", theme);
            }
        }
    });
    // Optionally, you can return the `running` Arc to allow stopping the listener
    // app.manage(running);
}

#[tauri::command]
fn check_tedana_installation(python_path: String) -> Result<String, String> {
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

// Run tedana functions in command-line
#[tauri::command]
fn run_tedana(python_path: String, args: Vec<String>) -> Result<String, String> {
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

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                listen_system_theme_changes(app_handle).await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_system_theme,
            check_tedana_installation,
            run_tedana
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
