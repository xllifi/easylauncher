/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_URL: string
  readonly VITE_AUTOUPDATE_GITHUB_REPO: string
  readonly VITE_LAUNCHERMETA: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
