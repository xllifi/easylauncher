import './assets/main.scss'

import { mount } from 'svelte'
import App from './App.svelte'
import * as Sentry from '@sentry/electron'
import { params } from './lib/stores/params.svelte.js'
import { get } from 'svelte/store'

Sentry.init({ dsn: import.meta.env.VITE_SENTRY_URL })
Sentry.setExtra('app_settings', JSON.stringify(get(params)).replace(/((?:accessToken|clientId)":").+?(?=")/gm, '$1REDACTED'))


const app = mount(App, { target: document.getElementById('app')! })

export default app
