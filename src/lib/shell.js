import * as tauriShell from '@tauri-apps/api/shell'

// -----------------------------------------------------------------------------
export async function execute({
  cmd = '',
  args = undefined,
  options = undefined,
  onStdout = msg => {},
  onStderr = msg => {},
  onError = msg => {}
}) {

  let command = new tauriShell.Command(cmd, args, options)

  command.stdout.on('data', msg => onStdout(msg))
  command.stderr.on('data', msg => onStderr(msg))

  let output = await command.execute()

  if (output.code !== 0) {
    onError(output.stderr)
  }

  return output
}

// -----------------------------------------------------------------------------
export async function spawn({
  cmd = '',
  args = undefined,
  options = undefined,
  onStdout = msg => {},
  onStderr = msg => {}
}) {

  let command = new tauriShell.Command(cmd, args, options)

  command.stdout.on('data', msg => onStdout(msg))
  command.stderr.on('data', msg => onStderr(msg))

  let child = await command.spawn()
  return child
}

// -----------------------------------------------------------------------------
export async function open({
  path = '',
  openWith = undefined
}) {

  await tauriShell.open(path, openWith)
}

// -----------------------------------------------------------------------------
export default {
  execute,
  spawn,
  open
}
