import { writable } from 'svelte/store'

export const route = writable({
  loaded: false,
  page: 'main',
  overlay: {
    current: 'none',
    previous: 'none'
  }
})
