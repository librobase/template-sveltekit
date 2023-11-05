<script>
  import micromamba from '$lib/stores/micromamba'
  import python from '$lib/stores/python'
  import directory from '$lib/stores/directory'
  import jupyter from '$lib/stores/jupyter'

  let stdout = ''
  let stderr = ''
  let errmsg = ''
  let pycodetxt = ''

  let pystdout = ''



  // ---------------------------------------------------------------------------
  async function createEnvironment() {
    stdout = ''
    stderr = ''
    let output = await micromamba.createEnvironment({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }

  // ---------------------------------------------------------------------------
  async function updateEnvironment() {
    stdout = ''
    stderr = ''
    let output = await micromamba.updateEnvironment({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }

  // ---------------------------------------------------------------------------
  async function installReqs() {
    stdout = ''
    stderr = ''
    let output = await python.installRequirements({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }



  async function runJupyterServer() {
    stdout = ''
    stderr = ''
    let output = await python.runJupyterServer({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }


  async function runJupyterLab() {
    stdout = ''
    stderr = ''
    let output = await python.runJupyterLab({
      onStdout: msg => {
        stdout += msg
      },
      onStderr: msg => {
        stderr += msg
      },
      onError: msg => {
        errmsg += msg
      }
    })
  }


  async function openPrefix() {
    stdout = ''
    stderr = ''
    let output = await directory.openPrefix()
  }


  async function openWorkspace() {
    stdout = ''
    stderr = ''
    let output = await directory.openWorkspace()
  }


  async function openAssets() {
    stdout = ''
    stderr = ''
    let output = await directory.openAssets()
  }

  


  async function connectjupyterServer() {
    await jupyter.connectJupyterServer()
  }

  async function connectjupyterLab() {
    await jupyter.connectJupyterLab()
  }


  async function runPyCode() {
    let output = await jupyter.execute({
      session: 'test',
      code: 'print("hellooooooo")',
      onStream: msg => {
        console.log(msg)
        //pystdout += msg
      }
    })
  }
</script>


<section class="p-3 flex flex-col gap-1">
  
  <dir>
    <button on:click={createEnvironment}>create env</button>
    <button on:click={updateEnvironment}>update env</button>
    <button on:click={installReqs}>install reqs</button>
    <button on:click={runJupyterServer}>run jupyter server</button>
    <button on:click={runJupyterLab}>run jupyter lab</button>
    <button on:click={openPrefix}>open prefix</button>
    <button on:click={openWorkspace}>open workspace</button>
    <button on:click={openAssets}>open Assets</button>

    <button on:click={connectjupyterServer}>connect to jupyter server</button>
    <button on:click={connectjupyterLab}>connect to jupyter lab</button>
    <hr>
    <input type="text" bind:value={pycodetxt}>
    <button on:click={runPyCode}>run py code</button>
  </dir>
  jupyter connected: {$jupyter.connected}
  <hr>
  micromamba busy: {$micromamba.busy}
  <br>
  python busy: {$python.busy}
  <hr>
  <pre class="text-blue-500">{stdout}</pre>
  <hr>
  <pre  class="text-orange-500">{stderr}</pre>
  <hr>
  <pre>{errmsg}</pre>

</section>