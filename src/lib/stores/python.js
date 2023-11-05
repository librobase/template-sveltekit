import {
  writable,
  get
} from 'svelte/store'

import shell from '$lib/use/shell'
import sessionStorage from '$lib/use/sessionStorage'
import localhost from '$lib/use/localhost'
import uuid from '$lib/use/uuid'

import directory from '$lib/stores/directory'

// -----------------------------------------------------------------------------
let { subscribe, set, update } = writable({
  jupyterServerPort: '',
  jupyterServerToken: '',

  jupyterLabPort: '',
  jupyterLabToken: '',
})

// -----------------------------------------------------------------------------
async function installRequirements({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'pip',
      'install',
      '-r', get(directory).requirements_txt
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  return output
}

// -----------------------------------------------------------------------------
async function freePort() {
  let port = ''

  let output = await shell.execute({
    cmd: 'python',
    args: [
      'free_port.py'
    ],
    options: {
      cwd: get(directory).assets
    },
    onStdout: msg => { port = parseInt(msg) },
    onStderr: msg => { console.log(msg) },
    onError : msg => { console.log(msg) }
  })

  return port
}

// -----------------------------------------------------------------------------
async function runJupyterServer({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  
  //let port = await freePort()
  let port = '8888'
  console.log(port)
  let token = uuid.generate()

  let store = get({ subscribe })
  let prev_port = store.jupyterServerPort
  let prev_token = store.jupyterServerToken
  store.jupyterServerPort = `${port}`
  store.jupyterServerToken = token
  set (store)

  sessionStorage.set('jupyterServer.port', port)
  sessionStorage.set('jupyterServer.token', token)

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'jupyter', 'server',
      `--ServerApp.port=${port}`,
      `--ServerApp.port_retries=0`,
      `--ServerApp.allow_origin='*'`,
      `--ServerApp.ip='localhost'`,
      `--ServerApp.allow_remote_access=True`,
      `--ServerApp.disable_check_xsrf=True`,
      `--PasswordIdentityProvider.hashed_password=''`,
      `--IdentityProvider.token='${token}'`
    ],
    options: {
      cwd: get(directory).workspace
    },
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  if (output.code) {
    store.jupyterServerPort = `${prev_port}`
    store.jupyterServerToken = prev_token
    set (store)

    sessionStorage.set('jupyterServer.port', prev_port)
    sessionStorage.set('jupyterServer.token', prev_token)
  }
  
  return output
  
}

// -----------------------------------------------------------------------------
async function runJupyterLab({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let port = await localhost.freePort()
  let token = uuid.generate()

  sessionStorage.set('jupyterLab.port', port)
  sessionStorage.set('jupyterLab.token', token)

  let store = get({ subscribe })
  store.jupyterLabPort = `${port}`
  store.jupyterLabToken = token
  set (store)

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'jupyter', 'lab',
      `--ServerApp.port=${port}`,
      `--IdentityProvider.token='${token}'`
    ],
    options: {
      cwd: get(directory).workspace
    },
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  return output
}

// -----------------------------------------------------------------------------
export default {
  // store
  subscribe,
  set,
  // functions
  installRequirements,
  runJupyterServer,
  runJupyterLab
}
