<script>
  import m from '$lib/module'
</script>


<section class="p-3 flex flex-col gap-1">
  
  <input type="text" bind:value={$m.var1}><br>
  <input type="text" bind:value={$m.var2}><br>
  
  <hr>
  <input type="text" bind:value={$m.var4.a}><br>
  <input type="text" bind:value={$m.var4.b}><br>

  <hr>
  <input type="text" bind:value={$m.var5.a}><br>
  <input type="text" bind:value={$m.var5.a.c}><br>
  <input type="text" bind:value={$m.var5.a.d}><br>
  <input type="text" bind:value={$m.var5.b}><br>
  <input type="text" bind:value={$m.var5.b.e}><br>
  <input type="text" bind:value={$m.var5.b.f}><br>


  <button on:click={m.display}>run func</button>

</section>