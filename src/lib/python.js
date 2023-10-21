import path from '$lib/path'
import shell from '$lib/shell'

// -----------------------------------------------------------------------------
export async function pipVersion({
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
export async function pipInstallRequirements({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let output = await shell.execute({
    cmd: 'pip-install-requirements',
    args: [
      'pip',
      'install',
      '-r', await path.resolveResource('resources', 'conda', 'requirements.txt')
    ],
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
export async function jupyterlab({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let output = await shell.execute({
    cmd: 'jupyter-lab',
    args: [
      'jupyter',
      'lab'
    ],
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
  pipVersion,
  pipInstallRequirements,
  jupyterlab
}
