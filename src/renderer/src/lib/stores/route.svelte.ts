import { get, writable } from 'svelte/store'
import { params } from './params.svelte.js'

export const route = writable({
  loaded: false,
  page: get(params).onboardingComplete ? 'main' : 'onboarding',
  state: 'idle',
  overlay: {
    current: 'none',
    previous: 'none'
  }
})
