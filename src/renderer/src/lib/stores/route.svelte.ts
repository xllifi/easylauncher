import { writable } from 'svelte/store'

export const route = writable({
  page: 'main',
  overlay: {
    current: 'none',
    previous: 'none'
  }
})
