import * as tauriPath from '@tauri-apps/api/path'

// -----------------------------------------------------------------------------
async function dirname(dir) {
  let p = await tauriPath.dirname(dir)
  return p
}

// -----------------------------------------------------------------------------
async function basename(dir) {
  let p = await tauriPath.basename(dir)
  return p
}

// -----------------------------------------------------------------------------
async function extname(dir) {
  let p = await tauriPath.extname(dir)
  return p
}

// -----------------------------------------------------------------------------
async function resolve(...dirs) {
  let p = await tauriPath.resolve(...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveResource(...dirs) {
  let base = await tauriPath.resourceDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveAppCache(...dirs) {
  let base = await tauriPath.appCacheDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveAppConfig(...dirs) {
  let base = await tauriPath.appConfigDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveAppData(...dirs) {
  let base = await tauriPath.appDataDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveAppLocalData(...dirs) {
  let base = await tauriPath.appLocalDataDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveAppLog(...dirs) {
  let base = await tauriPath.appLogDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveHome(...dirs) {
  let base = await tauriPath.homeDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveDesktop(...dirs) {
  let base = await tauriPath.desktopDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveDocument(...dirs) {
  let base = await tauriPath.documentDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
async function resolveDownload(...dirs) {
  let base = await tauriPath.downloadDir()
  let p = await tauriPath.resolve(base, ...dirs)
  return p
}

// -----------------------------------------------------------------------------
export default {
  dirname,
  basename,
  extname,
  resolve,
  resolveResource,
  resolveAppCache,
  resolveAppConfig,
  resolveAppData,
  resolveAppLocalData,
  resolveAppLog,
  resolveHome,
  resolveDesktop,
  resolveDocument,
  resolveDownload
}
