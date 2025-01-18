import { persisted, type Persisted } from 'svelte-persisted-store'
import type { launchCredentials } from 'xlicore'
import type { LauncherParams } from '../../../../main/types.js'

export const params: Persisted<LauncherParams> = persisted('preferences', {
  launchCredentials: {} as launchCredentials,
  modpackType: 'ful',
  onboardingComplete: false,
  rulesConfirmed: false,
  launchOpts: {
    memory: {
      min: 512,
      max: 6144
    },
    screen: {
      width: 854,
      height: 480
    },
    detached: true
  }
})
