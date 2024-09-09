// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dark_light::Mode;
// use std::process::Command;
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
        .invoke_handler(tauri::generate_handler![get_system_theme])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
