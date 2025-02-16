import { persisted, type Persisted } from 'svelte-persisted-store'
import type { launchCredentials } from 'xlicore'
import type { LauncherParams } from '../../../../main/types.js'
import type { DraslApiLoginResponse } from '../scripts/login.js'

export const params: Persisted<LauncherParams> = persisted('preferences', {
  launchCredentials: {} as accountInfo,
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

export type accountInfo = launchCredentials & DraslApiLoginResponse
