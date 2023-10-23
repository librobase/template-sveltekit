<script>
  import conda from '$lib/conda'
  import jupyter from '$lib/jupyter'

  let stdout = ''
  let stderr = ''
  let errmsg = ''

  let pystdout = ''

  async function updateEnvironment() {
    stdout = ''
    stderr = ''
    let output = await conda.updateEnvironment({
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


  async function runJupyterLab() {
    stdout = ''
    stderr = ''
    let output = await conda.runJupyterLab({
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
    let output = await conda.runJupyterServer({
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
      code: 'print("hellooooo")',
      onStream: msg => {
        console.log(msg)
        //pystdout += msg
      }
    })

    console.log(output)
  }
</script>


<section class="p-3 flex flex-col gap-1">
  
  <button on:click={updateEnvironment}>update conda env</button>
  <button on:click={installRequirements}>install requirements</button>
  <button on:click={runJupyterLab}>run jupyter lab</button>
  <button on:click={runJupyterServer}>run jupyter server</button>
  <button on:click={connectjupyter}>connect to jupyter</button>
  <button on:click={runPyCode}>run py code</button>
  {$jupyter.connected}
  <hr>
  <pre class="text-blue-500">{stdout}</pre>
  <hr>
  <pre  class="text-orange-500">{stderr}</pre>
  <hr>
  <pre>{errmsg}</pre>

</section>