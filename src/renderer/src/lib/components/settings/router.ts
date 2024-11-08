import { writable } from "svelte/store"

export const settingsPage = writable({
  page: 'main',
})