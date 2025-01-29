import { get, writable, type Writable } from 'svelte/store'
import { params } from './params.svelte.js'

export const route: Writable<Route> = writable({
  loaded: false,
  page: get(params).onboardingComplete ? 'main' : 'onboarding',
  modal: {
    current: 'none',
    previous: 'none'
  }
})

export type Route = {
  loaded: boolean,
  page: 'main' | 'onboarding'
  modal: {
    current: RouteModal,
    previous: RouteModal
  }
}

export type RouteModal = 'none' | 'settings' | 'login' | 'modpack' | 'rules' | 'feedback' | 'unknown'
