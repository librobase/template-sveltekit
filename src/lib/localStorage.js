import { browser } from '$app/environment'

// -----------------------------------------------------------------------------
export function set(key, value) {
  if (browser)
    localStorage.setItem(key, value)
}

// -----------------------------------------------------------------------------
export function get(key) {
  if (browser)
    return localStorage.getItem(key)
  return null
}

// -----------------------------------------------------------------------------
export function remove(key) {
  if (browser)
    localStorage.removeItem(key)
}

// -----------------------------------------------------------------------------
export function clear() {
  if (browser)
    localStorage.clear()
}

// -----------------------------------------------------------------------------
export default {
  set,
  get,
  remove,
  clear
}
