// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::net::TcpListener;

#[tauri::command]
fn free_port() -> u16 {
  for port in 49152..65535 {
    if TcpListener::bind(("127.0.0.1", port)).is_ok() {
      return port;
    }
  }
  panic!("Unable to find a free port!");
}


fn main() {
  let _ = fix_path_env::fix();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![free_port])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
