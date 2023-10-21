import { ServerConnection, ServiceManager } from '@jupyterlab/services'

import reactive from '$lib/use/reactive'
import localStorage from '$lib/use/localStorage'

// -----------------------------------------------------------------------------
export let $ = reactive.store({
  serviceManager: null,
  url: 'http://localhost:8888',
  running: reactive.store({}), // { session1: boolean, session2: boolean }
})

// -----------------------------------------------------------------------------
export async function setup() {
  let url = localStorage.get('jupyter.url')

  if (url)
    await connect(url)
}

// -----------------------------------------------------------------------------
export async function connect(url) {
  // if it is already connected to this server do nothing.
  if ($['serviceManager'] && $['url'] == url)
    return
  
  let serviceManager = await newServiceManager(url)

  if (serviceManager) {
    $['serviceManager'] = serviceManager
    $['url'] = url
    
    localStorage.set('jupyter.url', $['url'])
  }
  else {
    $['serviceManager'] = null
  }
}

// -----------------------------------------------------------------------------
export async function disconnect() {
  try {
    $['serviceManager'].dispose()
  }
  catch(err) {}
  finally {
    $['serviceManager'] = null
  }
}

// -----------------------------------------------------------------------------
export async function run({
  serviceManager = $['serviceManager'],
  session,
  code = '',
  onStatus = () => {},
  onBusy = () => {},
  onIdle = () => {},
  onExecuteInput = () => {},
  onDisplayData = () => {},
  onStream = () => {},
  onError = (msg) => { console.log(msg) },
  onIOPub = (msg) => { console.log(msg) },
  onReply = () => {}
}) {
  
  let sessionModel = await serviceManager.sessions.findByPath(session)
  if (!sessionModel)
    sessionModel = await startSession(serviceManager, session)

  let sessionConnection = await serviceManager.sessions.connectTo({ model: sessionModel })
  let future = sessionConnection.kernel.requestExecute({ code, store_history: false })

  future.onIOPub = (msg) => {
    let type = msg['header']['msg_type']
    if (type == 'status') {
      onStatus(msg)
      if (msg['content']['execution_state'] == 'busy') {
        $['running'][session] = true
        onBusy(msg)
      }
      else if (msg['content']['execution_state'] == 'idle') {
        $['running'][session] = false
        onIdle(msg)
      }
    }
    else if (type == 'execute_input') onExecuteInput(msg)
    else if (type == 'display_data')  onDisplayData(msg)
    else if (type == 'stream')        onStream(msg)
    else if (type == 'error')         onError(msg)
    else                              onIOPub(msg)
  }

  let status = false

  future.onReply = (msg) => {
    status = (msg.content.status == 'ok')
    onReply(msg)
  }

  await future.done
  return status
}

// -----------------------------------------------------------------------------
export async function shutdown({
  serviceManager = $['serviceManager'],
  session
}) {
  let sessionModel = await serviceManager.sessions.findByPath(session)
  console.log(sessionModel)
  await serviceManager.sessions.shutdown(sessionModel.id)
  console.log(serviceManager)
}

// -----------------------------------------------------------------------------
async function getServerStatus(url) {
  let status = null

  try {
    let urlObj = new URL(url)
    urlObj.pathname = '/api/status'
    let res = await fetch(urlObj)
    status = await res.json()
  }
  catch(err) {}

  return status
}

// -----------------------------------------------------------------------------
async function isServerAvailable(url) {
  let status = await getServerStatus(url)
  return status? true : false
}

// -----------------------------------------------------------------------------
function getServerConnectionObj(url) {
  let urlObj = new URL(url)
  let host = urlObj.host
  let token = urlObj.searchParams.get('token')
  token = token? token : ''

  let obj = {
    baseUrl: `http://${host}`,
    wsUrl: `ws://${host}`,
    appUrl: ``,
    token: `${token}`
  }

  return obj
}

// -----------------------------------------------------------------------------
async function newServiceManager(url) {
  let available = await isServerAvailable(url)

  if (!available)
    return null
  
  let connectionObj = getServerConnectionObj(url)
  let serverSettings = ServerConnection.makeSettings(connectionObj)
  let serviceManager = new ServiceManager({ serverSettings })
  await serviceManager.ready

  return serviceManager
}

// -----------------------------------------------------------------------------
async function startSession(serviceManager, path) {
  let createOptions = {
    path: path,
    type: "notebook",
    name: path,
    kernel: {
      name: "python"
    }
  }

  let connectOptions = {
    clientId: 'username',
    username: 'username',
    kernelConnectionOptions: {
      handleComms: undefined
    }
  }

  let sessionConnection = await serviceManager.sessions.startNew(createOptions, connectOptions)
  let sessionModel = await serviceManager.sessions.findByPath(path)
  return sessionModel
}

// -----------------------------------------------------------------------------
export default {
  $,
  setup,
  connect,
  run,
  shutdown
}
