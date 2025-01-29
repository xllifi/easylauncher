import { get, writable, type Writable } from 'svelte/store'
import { params } from './params.svelte.js'
import type { Component } from 'svelte'
import type { ModalProps } from '../modals/types.js'
import MainPage from '../pages/main/MainPage.svelte'
import OnboardingPage from '../pages/onboarding/OnboardingPage.svelte'

export const route: Writable<Route> = writable({
  loaded: false,
  page: get(params).onboardingComplete ? MainPage : OnboardingPage,
  modal: {
    current: null,
    previous: null
  }
})

export type Route = {
  loaded: boolean,
  page: Component<any>,
  modal: {
    current: RouteModal,
    previous: RouteModal
  }
}

export type RouteModal = null | Component<ModalProps, {}, "exit" | "back">
