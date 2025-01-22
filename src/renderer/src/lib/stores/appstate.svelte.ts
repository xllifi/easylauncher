import { writable, type Writable } from 'svelte/store'

export const appstate: Writable<State> = writable({
  current: 'idle',
  minecraftPids: []
})

type State = {
  current: 'idle' | 'launch',
  minecraftPids: number[],
}
