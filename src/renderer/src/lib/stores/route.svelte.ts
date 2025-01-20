import { get, writable, type Writable } from 'svelte/store'
import { params } from './params.svelte.js'

export const route: Writable<Route> = writable({
  loaded: false,
  page: get(params).onboardingComplete ? 'main' : 'onboarding',
  overlay: {
    current: 'none',
    previous: 'none'
  }
})

export type Route = {
  loaded: boolean,
  page: 'main' | 'onboarding'
  overlay: {
    current: RouteOverlay,
    previous: RouteOverlay
  }
}

type RouteOverlay = 'none' | 'settings' | 'login' | 'modpack' | 'rules' | 'feedback' | 'unknown'
