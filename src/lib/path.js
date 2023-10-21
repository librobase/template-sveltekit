import * as tauriPath from '@tauri-apps/api/path'

// -----------------------------------------------------------------------------
export async function resolve(...dirs) {
  let p = await tauriPath.resolve(...dirs)
  return p
}

// -----------------------------------------------------------------------------
export async function resolveResource(...dirs) {
  let base = await tauriPath.resourceDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
export async function resolveAppData(...dirs) {
  let base = await tauriPath.appDataDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
export async function resolveAppConfig(...dirs) {
  let base = await tauriPath.appConfigDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
export default {
  resolve,
  resolveResource,
  resolveAppData,
  resolveAppConfig
}
