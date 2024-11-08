import { persisted } from 'svelte-persisted-store'

export const params = persisted('preferences', {
  opt1: true,
  opt2: false,
  opt3: 'placeholder'
})