import { persisted, type Persisted } from 'svelte-persisted-store'
import type { launchCredentials } from 'xlicore'
import type { LauncherParams } from '../../../../main/types.js'

export const params: Persisted<LauncherParams> = persisted('preferences', {
  launchCredentials: {} as launchCredentials,
  launchOpts: {
    memory: {
      min: 512,
      max: 6144
    }
  }
})
