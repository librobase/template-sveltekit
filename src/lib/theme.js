import { browser } from '$app/environment'

import reactive from '$lib/use/reactive'
import localStorage from '$lib/use/localStorage'

// -----------------------------------------------------------------------------
export let $ = reactive.store({
  state: 'light'
})

// -----------------------------------------------------------------------------
export function setup() {
  let states = ['light', 'dark']

  let state = localStorage.get('theme.state')

  if (state === null)
    state = 'light'
  else if (!states.includes(state))
    state = 'light'
  
  $['state'] = state

  // subscribe: listen to store
  $.subscribe(obj => {
    localStorage.set('theme.state', $['state'])
    if (browser)
      ($['state'] == 'dark')
        ? document.body.classList.add('dark')
        : document.body.classList.remove('dark')
  })
}

// -----------------------------------------------------------------------------
export function toggle() {
  if ($['state'] == 'dark')
    $['state'] = 'light'
  else
  $['state'] = 'dark'
}

// -----------------------------------------------------------------------------
export default {
  $,
  setup,
  toggle
}
