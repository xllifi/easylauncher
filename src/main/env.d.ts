/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}