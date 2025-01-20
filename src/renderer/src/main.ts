import './assets/main.scss'

import { mount } from 'svelte'
import App from './App.svelte'
import * as Sentry from '@sentry/svelte'
import { params } from './lib/stores/params.svelte.js'
import { get } from 'svelte/store'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_URL,
  environment: import.meta.env.PROD ? 'production' : import.meta.env.DEV ? 'development' : 'unknown',
})
Sentry.setExtra('app_settings', JSON.stringify(get(params)).replace(/((?:accessToken|clientId)":").+?(?=")/gm, '$1REDACTED'))
Sentry.setExtra('source', 'FRONTEND')


const app = mount(App, { target: document.getElementById('app')! })

export default app
