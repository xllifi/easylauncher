import { persisted } from 'svelte-persisted-store'

export const params = persisted('preferences', {
  username: 'Steve',
  testopt: true,
  launchParams: {
    maxMem: 6144,
    minMem: 512
  }
})
