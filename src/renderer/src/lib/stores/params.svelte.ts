import { persisted, type Persisted } from 'svelte-persisted-store'
import type { launchCredentials } from 'xlicore'
import type { SharedParams } from '../../../../main/types.js'
import type { DraslApiUser } from '../types/login.js'
import { getLocaleFromNavigator } from 'svelte-i18n'

export const defaultParams: FrontParams = {
  onboardingComplete: false,
  rulesConfirmed: false,
  successfullLogin: false,
  draslApiUser: null,
  shared: {
    lang: getLocaleFromNavigator()!,
    launchCredentials: {} as launchCredentials,
    modpackType: 'ful',
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
  }
}
export const params: Persisted<FrontParams> = persisted('preferences', defaultParams)

export type FrontParams = {
  onboardingComplete: boolean
  rulesConfirmed: boolean
  successfullLogin: boolean
  draslApiUser: DraslApiUser | null
  shared: SharedParams
}
