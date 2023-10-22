import {
  writable,
  get
} from 'svelte/store'

import path from '$lib/path'
import shell from '$lib/shell'

// -----------------------------------------------------------------------------
let condaenvPath = await path.resolveResource('condaenv')
let condaenvBinPath = await path.resolveResource('condaenv', 'bin')

let environmentYamlPath = await path.resolveResource('assets', 'conda', 'environment.yaml')
let requirementsTxtPath = await path.resolveResource('assets', 'conda', 'requirements.txt')

let { subscribe, set, update } = writable({
  condaenvUpdated: false,
  requirementsInstalled: false
})

// -----------------------------------------------------------------------------
async function updateEnvironment({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let store = get({ subscribe })

  let output = await shell.execute({
    cmd: 'conda-env-update',
    args: [
      'env',
      'update',
      '--prefix', condaenvPath,
      '--file', environmentYamlPath
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  if (output.code === 0) {
    store.condaenvUpdated = true
    set(store)
  }

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
    cmd: 'pip-install-requirements',
    args: [
      'pip',
      'install',
      '-r', requirementsTxtPath
    ],
    options: {
      cwd: condaenvBinPath
    },
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  if (output.code === 0) {
    store.requirementsInstalled = true
    set(store)
  }
  
  return output
}

// -----------------------------------------------------------------------------
async function runJupyterLab({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let store = get({ subscribe })

  let output = await shell.execute({
    cmd: 'run-jupyter-lab',
    args: [
      'jupyter',
      'lab'
    ],
    options: {
      cwd: condaenvBinPath
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
  updateEnvironment,
  installRequirements,
  runJupyterLab
}
