<script>
  import conda from '$lib/conda'

  let stdout = ''
  let stderr = ''
  let errmsg = ''

  function updateEnvironment() {
    conda.updateEnvironment({
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
</script>


<section class="p-3 flex flex-col gap-1">
  
  <button on:click={updateEnvironment}>update conda env</button>
  <hr>
  <pre>{stdout}</pre>
  <hr>
  <pre>{stderr}</pre>
  <hr>
  <pre>{errmsg}</pre>

</section>