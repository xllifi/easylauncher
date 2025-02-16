import { accountInfo } from '../renderer/src/lib/stores/params.svelte.ts'

export type LauncherParams = {
  lang?: string
  modpackType: 'min' | 'ess' | 'ful'
  onboardingComplete: boolean
  rulesConfirmed: boolean
  launchCredentials: accountInfo
  launchOpts: {
    memory: {
      min: number
      max: number
    }
    screen: {
      width: number
      height: number
    }
    detached: boolean
  }
}
