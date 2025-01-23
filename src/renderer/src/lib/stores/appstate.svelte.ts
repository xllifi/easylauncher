import { writable, type Writable } from 'svelte/store'

export const appstate: Writable<State> = writable({
  current: 'idle',
  updateFound: false,
  minecraftPids: []
})

type State = {
  current: 'idle' | 'launch',
  updateFound: boolean,
  minecraftPids: number[],
}
