import { launchCredentials } from "xlicore"

export type LauncherParams = {
  lang?: string,
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
  }
}
