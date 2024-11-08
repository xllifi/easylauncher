import { persisted } from 'svelte-persisted-store'

export const params = persisted('preferences', {
  username: 'Steve',
  testopt: false,
})
