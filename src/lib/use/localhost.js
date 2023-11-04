import tauri from '$lib/use/tauri'

// -----------------------------------------------------------------------------
async function freePort() {
  let p = await tauri.invoke('free_port')
  return p
}

// -----------------------------------------------------------------------------
export default {
  freePort
}
