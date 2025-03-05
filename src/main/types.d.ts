import { launchCredentials } from 'xlicore'

export type SharedParams = {
  lang: string
  launchCredentials: launchCredentials
  modpackType: 'min' | 'ess' | 'ful'
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

export type LauncherMeta = {
  mc_version: string
  fabric_version: string
  modpack: null | {
    ess?: LauncherMetaModpack
    min?: LauncherMetaModpack
    ful?: LauncherMetaModpack
  }
}

type LauncherMetaModpack = {
  url: string
  verify?: {
    hash: string
    algorithm: 'sha1' | 'sha256'
  }
}
