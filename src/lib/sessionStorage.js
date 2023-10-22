import { browser } from '$app/environment'

// -----------------------------------------------------------------------------
export function set(key, value) {
  if (browser)
    sessionStorage.setItem(key, value)
}

// -----------------------------------------------------------------------------
export function get(key) {
  if (browser)
    return sessionStorage.getItem(key)
  return null
}

// -----------------------------------------------------------------------------
export function remove(key) {
  if (browser)
    sessionStorage.removeItem(key)
}

// -----------------------------------------------------------------------------
export function clear() {
  if (browser)
    sessionStorage.clear()
}

// -----------------------------------------------------------------------------
export default {
  set,
  get,
  remove,
  clear
}
