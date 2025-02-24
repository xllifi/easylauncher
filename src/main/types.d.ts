import { launchCredentials } from 'xlicore'

export type SharedParams = {
  lang: string
  launchCredentials: launchCredentials
  modpackType: 'min' | 'ess' | 'ful'
  launchOpts: {
    memory: {
      min: number,
      max: number
    },
    screen: {
      width: number,
      height: number
    },
    detached: boolean
  }
}
