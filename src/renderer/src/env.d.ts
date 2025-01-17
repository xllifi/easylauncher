/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_URL: string
  readonly VITE_AUTH_HOST: string
  readonly APP_VERSION: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
