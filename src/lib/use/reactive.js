import { writable, get } from 'svelte/store'

// -----------------------------------------------------------------------------
export function store(obj) {
  let { subscribe, set, update } = writable(obj)

  let getObj = () => {
    let obj = get({ subscribe })
    return obj
  }

  let handler = {
    get: (target, prop) => {
      if (prop == 'subscribe') {
        return subscribe
      } else if (prop == 'getObj') {
        return getObj
      } else {
        let obj = get({ subscribe })
        return obj[prop]
      }
    },
    set: (target, prop, value) => {
      let obj = get({ subscribe })
      obj[prop] = value
      set(obj)
      return true
    }
  }

  let newStore = new Proxy({ subscribe, getObj }, handler)

  return newStore
}

// -----------------------------------------------------------------------------
export default {
  store
}
