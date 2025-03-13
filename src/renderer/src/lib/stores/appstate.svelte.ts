import { writable, type Writable } from 'svelte/store'

export const appstate: Writable<State> = writable({
  current: 'idle',
  updateStatus: null,
  minecraftPids: []
})

type State = {
  current: 'idle' | 'launch',
  updateStatus: 'found' | 'failed' | null,
  minecraftPids: number[],
}
