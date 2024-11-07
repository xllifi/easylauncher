import { writable } from 'svelte/store'

export class Settings {
  username: string | null
}

export const settings = writable({
  username: null
} as Settings)
