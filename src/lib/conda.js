import path from '$lib/path'
import shell from '$lib/shell'

// -----------------------------------------------------------------------------
export async function updateEnvironment({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let output = await shell.execute({
    cmd: 'conda-env-update',
    args: [
      "env",
      "update",
      "--prefix", `${await path.resolveResource('resources', 'condaenv')}`,
      "--file", `${await path.resolveResource('resources', 'conda', 'environment.yaml')}`
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })

  return output
}

// -----------------------------------------------------------------------------
export async function getPipVersion({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let output = await shell.execute({
    cmd: 'pip-version',
    options: {
      cwd: await path.resolveAppData('condaenv', 'bin')
    },
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })
  
  return output
}

// -----------------------------------------------------------------------------
export default {
  updateEnvironment,
  getPipVersion
}
