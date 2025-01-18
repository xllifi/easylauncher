import './assets/main.scss'

import { mount } from 'svelte'
import App from './App.svelte'
import * as Sentry from "@sentry/electron";
import { params } from './lib/stores/params.svelte.js';
import { get } from 'svelte/store';

Sentry.init({ dsn: 'https://f3c5d61a7f01460390091cfcb30e6f91@sentry.xllifi.ru/1' })
Sentry.setExtra('app_settings', JSON.stringify(get(params)).replace(/((?:accessToken|clientId)":").+?(?=")/gm, "$1REDACTED"))

const app = mount(App, { target: document.getElementById('app')! })

export default app
