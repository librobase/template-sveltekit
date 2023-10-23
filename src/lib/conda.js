import path from '$lib/path'
import shell from '$lib/shell'

// -----------------------------------------------------------------------------
let condaenvPath = ''
let condaenvBinPath = ''

let environmentYamlPath = ''
let requirementsTxtPath = ''

reload()

// -----------------------------------------------------------------------------
async function reload() {
  condaenvPath = await path.resolveResource('condaenv')
  condaenvBinPath = await path.resolveResource('condaenv', 'bin')

  environmentYamlPath = await path.resolveResource('assets', 'conda', 'environment.yaml')
  requirementsTxtPath = await path.resolveResource('assets', 'conda', 'requirements.txt')
}

// -----------------------------------------------------------------------------
async function updateEnvironment({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

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

  return output
}

// -----------------------------------------------------------------------------
async function installRequirements({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let output = await shell.execute({
    cmd: 'pip-install-requirements',
    args: [
      'run',
      '-p', condaenvPath,
      '--live-stream',
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
  
  return output
}

// -----------------------------------------------------------------------------
async function runJupyterLab({
  onStdout = msg => {},
  onStderr = msg => {},
  onError  = msg => {}
}) {

  let output = await shell.execute({
    cmd: 'run-jupyter-lab',
    args: [
      'run',
      '-p', condaenvPath,
      '--live-stream',
      'jupyter', 'lab'
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
    cmd: 'run-jupyter-server',
    args: [
      "run",
      "-p", condaenvPath,
      "--live-stream",
      "jupyter", "server",
      "--ServerApp.token", "''",
      "--ServerApp.password", "''",
      "--ServerApp.allow_origin", "'*'",
      "--ServerApp.ip", "'*'",
      "--ServerApp.allow_remote_access", "True",
      "--ServerApp.disable_check_xsrf", "True"
    ],
    onStdout: msg => onStdout(msg),
    onStderr: msg => onStderr(msg),
    onError : msg => onError(msg)
  })
  
  return output
}

// -----------------------------------------------------------------------------
export default {
  updateEnvironment,
  installRequirements,
  runJupyterLab,
  runJupyterServer
}
