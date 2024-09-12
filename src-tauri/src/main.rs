// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod bids;
mod tedana;
mod theme;

#[tauri::command]
fn get_system_theme() -> String {
    theme::get_system_theme()
}

#[tauri::command]
async fn listen_system_theme_changes(app: tauri::AppHandle) {
    theme::listen_system_theme_changes(app).await;
}

#[tauri::command]
fn check_tedana_installation(python_path: String) -> Result<String, String> {
    tedana::check_tedana_installation(python_path)
}

#[tauri::command]
fn run_tedana(python_path: String, args: Vec<String>) -> Result<String, String> {
    tedana::run_tedana(python_path, args)
}

#[tauri::command]
fn validate_bids_directory(path: String) -> Result<String, String> {
    bids::validate_bids_directory(path)
}

#[tauri::command]
fn extract_bold_metadata(path: String) -> Result<Vec<bids::BoldMetadata>, String> {
    bids::extract_bold_metadata(&path)
}

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
            run_tedana,
            validate_bids_directory,
            extract_bold_metadata
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
