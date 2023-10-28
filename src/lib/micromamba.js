import {
  writable,
  get
} from 'svelte/store'

import path from '$lib/path'
import shell from '$lib/shell'

// -----------------------------------------------------------------------------
let prefixPath = ''
let environmentYamlPath = ''

reload()

// -----------------------------------------------------------------------------
async function reload() {
  prefixPath = await path.resolveResource('prefix')
  environmentYamlPath = await path.resolveResource('assets', 'mamba', 'environment.yaml')
}

// -----------------------------------------------------------------------------
async function createEnvironment({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let output = await shell.execute({
    sidecar: 'bin/micromamba',
    args: [
      '--yes',
      'create',
      '--prefix', prefixPath,
      '--file', environmentYamlPath
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

  let output = await shell.execute({
    sidecar: 'bin/micromamba',
    args: [
      '--yes',
      'update',
      '--prefix', prefixPath,
      '--file', environmentYamlPath
    ],
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

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'jupyter', 'lab'
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  return output
}

// -----------------------------------------------------------------------------
async function stopJupyterLab({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let output = await shell.execute({
    cmd: 'micromamba-create',
    args: [
      '-y',
      'ps',
      'stop', 'jupyterlab_process'
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  return output
}

// -----------------------------------------------------------------------------
async function openPrefix() {
  shell.open({ path: prefixPath })
}

// -----------------------------------------------------------------------------
export default {
  createEnvironment,
  updateEnvironment,
  openPrefix,
  runJupyterLab
}