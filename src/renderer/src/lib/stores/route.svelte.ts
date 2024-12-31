import { get, writable } from 'svelte/store'
import { params } from './params.svelte.js'

export const route = writable({
  loaded: false,
  page: get(params).onboardingComplete ? 'main' : 'onboarding',
  overlay: {
    current: 'modpack',
    previous: 'none'
  }
})
