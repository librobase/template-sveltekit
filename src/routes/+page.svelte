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

    console.log(output)
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

    console.log(output)
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

    console.log(output)
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

    console.log(output)
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

    console.log(output)
  }


  async function openPrefix() {
    stdout = ''
    stderr = ''
    let output = await directory.openPrefix()

    console.log(output)
  }


  async function openWorkspace() {
    stdout = ''
    stderr = ''
    let output = await directory.openWorkspace()

    console.log(output)
  }


  async function openAssets() {
    stdout = ''
    stderr = ''
    let output = await directory.openAssets()

    console.log(output)
  }

  


  async function connectjupyter() {
    await jupyter.connectJupyterServer()
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

    console.log(output)
  }
</script>


<section class="p-3 flex flex-col gap-1">
  
  <dir>
    <button on:click={createEnvironment}>create env</button>
    <button on:click={updateEnvironment}>update env</button>
    <button on:click={installReqs}>install reqs</button>
    <button on:click={runJupyterServer}>run jupyter server</button>
    <!--button on:click={runJupyterLab}>run jupyter lab</button-->
    <button on:click={openPrefix}>open prefix</button>
    <button on:click={openWorkspace}>open workspace</button>
    <button on:click={openAssets}>open Assets</button>

    <button on:click={connectjupyter}>connect to jupyter</button>
    <hr>
    <input type="text" bind:value={pycodetxt}>
    <button on:click={runPyCode}>run py code</button>
  </dir>
  {$jupyter.connected}
  <hr>
  <pre class="text-blue-500">{stdout}</pre>
  <hr>
  <pre  class="text-orange-500">{stderr}</pre>
  <hr>
  <pre>{errmsg}</pre>

</section>