<script>
  import conda from '$lib/conda'

  let stdout = ''
  let stderr = ''
  let errmsg = ''

  async function updateEnvironment() {
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
</script>


<section class="p-3 flex flex-col gap-1">
  
  <button on:click={updateEnvironment}>update conda env</button>
  <button on:click={installRequirements}>install requirements</button>
  <button on:click={runJupyterLab}>run jupyter lab</button>
  <hr>
  <pre class="text-blue-500">{stdout}</pre>
  <hr>
  <pre  class="text-orange-500">{stderr}</pre>
  <hr>
  <pre>{errmsg}</pre>

</section>