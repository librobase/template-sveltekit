<script>
  import { onMount } from 'svelte'

  import jupyter from '$lib/stores/jupyter'

  import VPane from '$lib/components/VPane.svelte'
  import SPane from '$lib/components/SPane.svelte'

  // ---------------------------------------------------------------------------
  let minValue = 0
  let maxValue = 10
  let nValue = 100

  let plotStr = ''

  // ---------------------------------------------------------------------------
  onMount(async () => {
    await jupyter.connectJupyterServer()
  })

  // ---------------------------------------------------------------------------
  async function drawSamplePlot() {
    let c = ``
    c += `import numpy as np\n`
    c += `import matplotlib.pyplot as plt\n`
    c += `x = np.linspace(${minValue}, ${maxValue}, ${nValue})\n`
    c += `y = np.sin(x)\n`
    c += `plt.plot(x, y)\n`

    jupyter.execute({
      session: 'test_session',
      code: c,
      onIOPub: msg => {
        console.log(msg)
      },
      onDisplayData: msg => {
        plotStr = msg.content.data['image/png']
      }
    })
  }
</script>

<!--/////////////////////////////////////////////////////////////////////////-->

<VPane>

  <svelte:fragment slot="top">
    <SPane></SPane>
  </svelte:fragment>

  <hr>

  <svelte:fragment slot="center">
    <SPane class="p-3">
      <div class="p-5">
        <input bind:value={minValue}>
        <input bind:value={maxValue}>
        <input bind:value={nValue}>
      </div>
      
      <button on:click={drawSamplePlot}>Draw Plot</button>
      <button on:click={() => {plotStr = ''}}>Clear Plot</button>
      <hr class="my-3">
      {#if plotStr !== ''}
        <img src="data:image/png;base64,{plotStr}" alt="">
      {/if}
    </SPane>
  </svelte:fragment>

</VPane>