// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod bids;
mod tedana;
mod theme;
use bids::BidsStructure;

#[tauri::command]
fn get_system_theme() -> String {
    theme::get_system_theme()
}

#[tauri::command]
async fn listen_system_theme_changes(app: tauri::AppHandle) {
    theme::listen_system_theme_changes(app).await;
}

#[tauri::command]
fn check_tedana_installation(
    python_path: String,
    environment_path: Option<String>,
) -> Result<String, String> {
    tedana::check_tedana_installation(python_path, environment_path)
}

#[tauri::command]
async fn run_tedana_command(
    window: tauri::Window,
    python_path: String,
    command_args: String,
) -> Result<String, String> {
    tedana::run_tedana(window, python_path, command_args).await
}

#[tauri::command]
async fn kill_tedana_command() -> Result<(), String> {
    tedana::kill_tedana().await
}

#[tauri::command]
fn validate_bids_directory(path: String, convention: String) -> Result<String, String> {
    bids::validate_bids_directory(path, convention)
}

#[tauri::command]
fn extract_bids_structure(path: String, convention: String) -> Result<BidsStructure, String> {
    bids::extract_bids_structure(&path, &convention)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                listen_system_theme_changes(app_handle).await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_system_theme,
            check_tedana_installation,
            run_tedana_command,
            kill_tedana_command,
            validate_bids_directory,
            extract_bids_structure
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
