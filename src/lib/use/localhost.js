import tauri from '$lib/use/tauri'
import shell from '$lib/use/shell'

// -----------------------------------------------------------------------------
async function freePort() {
  
  let port = ''

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-c', c
    ],
    onStdout: msg => { console.log(msg) },
    onStderr: msg => { console.log('error in lib/use/localohost.freeport') },
    onError : msg => { console.log('error in lib/use/localohost.freeport') }
  })

  return port
}

// -----------------------------------------------------------------------------
export default {
  freePort
}
