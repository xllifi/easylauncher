import { get, writable, type Writable } from 'svelte/store'
import { params } from './params.svelte.js'
import type { Component } from 'svelte'
import type { ModalProps } from '../modals/types.js'

export const route: Writable<Route> = writable({
  loaded: false,
  page: get(params).onboardingComplete ? 'main' : 'onboarding',
  modal: {
    current: null,
    previous: null
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

export type RouteModal = null | Component<ModalProps, {}, "exit" | "back">
