import {
  writable,
  get
} from 'svelte/store'

import { invoke } from '@tauri-apps/api/tauri'

import path from '$lib/path'
import shell from '$lib/shell'

// -----------------------------------------------------------------------------
let prefix = ''
let environmentYamlPath = ''
let requirementsTxtPath = ''

reload()

// -----------------------------------------------------------------------------
async function reload() {
  prefix = await path.resolveResource('prefix')
  environmentYamlPath = await path.resolveResource('assets', 'environment.yaml')
  requirementsTxtPath = await path.resolveResource('assets', 'requirements.txt')
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
      '--prefix', prefix,
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
      '--prefix', prefix,
      '--file', environmentYamlPath
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

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'pip',
      'install',
      '-r', requirementsTxtPath
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

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'jupyter', 'server',
      `--ServerApp.port=1402`,
      `--IdentityProvider.token='salam'`
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

  let ppp = await invoke('free_port')
  console.log(ppp)

  let output = await shell.execute({
    cmd: 'python',
    args: [
      '-m',
      'jupyter', 'lab',
      `--ServerApp.port=${ppp}`,
      `--IdentityProvider.token='salam'`
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  return output
}

// -----------------------------------------------------------------------------
async function openPrefix() {
  shell.open({ path: prefix })
}

// -----------------------------------------------------------------------------
export default {
  createEnvironment,
  updateEnvironment,
  installRequirements,
  runJupyterServer,
  runJupyterLab,
  openPrefix
}