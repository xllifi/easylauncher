import { launchCredentials } from 'xlicore'

export type LauncherParams = {
  lang?: string
  modpackType: 'min' | 'ess' | 'ful'
  onboardingComplete: boolean
  launchCredentials: launchCredentials
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
