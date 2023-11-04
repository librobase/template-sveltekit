import {
  writable,
  get
} from 'svelte/store'

import path from '$lib/path'
import shell from '$lib/shell'
import rust from '$lib/rust'
import sessionStorage from '$lib/sessionStorage'
import { resolveResource } from '@tauri-apps/api/path'

// -----------------------------------------------------------------------------
let { subscribe, set, update } = writable({
  prefix: '',
  environmentYamlPath: '',
  requirementsTxtPath: '',
  
  workspace: '',

  jupyterServerPort: '',
  jupyterServerToken: '',

  jupyterLabPort: '',
  jupyterLabToken: '',
})

reload()

// -----------------------------------------------------------------------------
async function reload() {
  let store = get({ subscribe })

  store.prefix = await path.resolveResource('prefix')
  store.environmentYamlPath = await path.resolveResource('assets', 'environment.yaml')
  store.requirementsTxtPath = await path.resolveResource('assets', 'requirements.txt')

  store.workspace = await path.resolveResource('workspace')

  set (store)
}

// -----------------------------------------------------------------------------
async function createEnvironment({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let store = get({ subscribe })

  let output = await shell.execute({
    sidecar: 'bin/micromamba',
    args: [
      '--yes',
      'create',
      '--prefix', store.prefix,
      '--file', store.environmentYamlPath
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  return output
}

// -----------------------------------------------------------------------------
async function updateEnvironment({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let store = get({ subscribe })

  let output = await shell.execute({
    sidecar: 'bin/micromamba',
    args: [
      '--yes',
      'update',
      '--prefix', store.prefix,
      '--file', store.environmentYamlPath
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  return output
}

// -----------------------------------------------------------------------------
async function installRequirements({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let store = get({ subscribe })

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'pip',
      'install',
      '-r', store.requirementsTxtPath
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

  let store = get({ subscribe })

  store.jupyterServerPort = `${await rust.invoke('free_port')}`
  store.jupyterServerToken = crypto.randomUUID()
  set (store)

  sessionStorage.set('jupyterServer.port', store.jupyterServerPort)
  sessionStorage.set('jupyterServer.token', store.jupyterServerToken)

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'jupyter', 'server',
      `--ServerApp.port=${store.jupyterServerPort}`,
      `--IdentityProvider.token='${store.jupyterServerToken}'`
    ],
    options: { cwd: store.workspace },
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

  let store = get({ subscribe })

  store.jupyterLabPort = `${await rust.invoke('free_port')}`
  store.jupyterLabToken = crypto.randomUUID()
  set (store)

  sessionStorage.set('jupyterLab.port', store.jupyterLabPort)
  sessionStorage.set('jupyterLab.token', store.jupyterLabToken)

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'jupyter', 'lab',
      `--ServerApp.port=${store.jupyterLabPort}`,
      `--IdentityProvider.token='${store.jupyterLabToken}'`
    ],
    options: { cwd: store.workspace },
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  return output
}

// -----------------------------------------------------------------------------
async function openPrefix() {
  let store = get({ subscribe })

  shell.open({ path: store.prefix })
}

// -----------------------------------------------------------------------------
async function openWorkspace() {
  let store = get({ subscribe })

  shell.open({ path: store.workspace })
}

// -----------------------------------------------------------------------------
export default {
  // store
  subscribe,
  set,
  // functions
  createEnvironment,
  updateEnvironment,
  installRequirements,
  runJupyterServer,
  runJupyterLab,
  openPrefix,
  openWorkspace
}