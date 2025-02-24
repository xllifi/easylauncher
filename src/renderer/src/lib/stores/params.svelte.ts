import { persisted, type Persisted } from 'svelte-persisted-store'
import type { launchCredentials } from 'xlicore'
import type { SharedParams } from '../../../../main/types.js'

export const params: Persisted<FrontParams> = persisted('preferences', {
  onboardingComplete: false,
  rulesConfirmed: false,
  shared: {
    lang: 'ru',
    launchCredentials: {} as launchCredentials,
    modpackType: 'ful',
    launchOpts: {
      memory: {
        min: 512,
        max: 6144,
      },
      screen: {
        width: 854,
        height: 480,
      },
      detached: true,
    },
  },
})

type FrontParams = {
  onboardingComplete: boolean,
  rulesConfirmed: boolean,
  shared: SharedParams
}
