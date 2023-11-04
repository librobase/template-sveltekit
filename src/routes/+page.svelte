<script>
  import conda from '$lib/conda'
  import micromamba from '$lib/micromamba'
  import jupyter from '$lib/jupyter'
  import shell from '$lib/shell'
  import path from '$lib/path'

  let stdout = ''
  let stderr = ''
  let errmsg = ''
  let pycodetxt = ''

  let pystdout = ''

  async function echoPath() {
    stdout = ''
    stderr = ''

    let envmap = new Map()
    envmap.set('a', 'salaaaaam')
    let pp = await path.resolveAppData()
    console.log(pp)
    // envmap.set('PATH', pp)
    //envmap.set('PATH', '/usr/local/bin')
    let output = await shell.execute({
      cmd: 'echo',
      args: [
        'PATH'
      ],
      options: {
        env: envmap
      },
      onStdout: msg => stdout += msg,
      onStderr: msg => stderr += msg,
      onError : msg => errmsg  = msg
    })

    console.log(output)
  }

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
    let output = await micromamba.installRequirements({
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
  async function openEnvironment() {
    await micromamba.openPrefix()
  }


  async function installRequirements() {
    stdout = ''
    stderr = ''
    let output = await conda.installRequirements({
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
    let output = await micromamba.runJupyterServer({
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
    let output = await micromamba.runJupyterLab({
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

  


  async function connectjupyter() {
    await jupyter.connect('http://localhost:8888')
  }


  async function runPyCode() {
    let output = await jupyter.execute({
      session: 'test',
      code: pycodetxt,
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
    <button on:click={openEnvironment}>open menv</button>
    <button on:click={runJupyterServer}>run jupyter server</button>
    <button on:click={runJupyterLab}>run jupyter lab</button>
    <!--button on:click={runJupyterServer}>run jupyter server</button>
    <button on:click={connectjupyter}>connect to jupyter</button>
    <hr>
    <input type="text" bind:value={pycodetxt}>
    <button on:click={runPyCode}>run py code</button-->
  </dir>
  {$jupyter.connected}
  <hr>
  <pre class="text-blue-500">{stdout}</pre>
  <hr>
  <pre  class="text-orange-500">{stderr}</pre>
  <hr>
  <pre>{errmsg}</pre>

</section>