import './assets/main.scss'

import { mount } from 'svelte'
import App from './App.svelte'
import * as Sentry from "@sentry/electron";

Sentry.init({ dsn: 'https://f3c5d61a7f01460390091cfcb30e6f91@sentry.xllifi.ru/1' })

const app = mount(App, { target: document.getElementById('app')! })

export default app
