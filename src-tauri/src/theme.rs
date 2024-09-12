use dark_light::Mode;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tauri::Manager;

pub fn get_system_theme() -> String {
    match dark_light::detect() {
        Mode::Dark => "dim".to_string(),
        Mode::Light | Mode::Default => "emerald".to_string(),
    }
}

pub async fn listen_system_theme_changes(app: tauri::AppHandle) {
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
}
