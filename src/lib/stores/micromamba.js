import {
  writable,
  get
} from 'svelte/store'

import shell from '$lib/use/shell'

import directory from '$lib/stores/directory'

// -----------------------------------------------------------------------------
let { subscribe, set, update } = writable({})

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
      '--prefix', get(directory).prefix,
      '--file', get(directory).environment_yaml
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
      '--prefix', get(directory).prefix,
      '--file', get(directory).environment_yaml
    ],
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
  createEnvironment,
  updateEnvironment
}
