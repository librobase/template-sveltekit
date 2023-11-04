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
async function runJupyterServer({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let port = await localhost.freePort()
  let token = uuid.generate()

  sessionStorage.set('jupyterServer.port', port)
  sessionStorage.set('jupyterServer.token', token)

  let store = get({ subscribe })
  store.jupyterServerPort = `${port}`
  store.jupyterServerToken = token
  set (store)

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'jupyter', 'server',
      `--ServerApp.config_file='${get(directory).jupyter_server_config_py}'`,
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
