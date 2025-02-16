import ky, { TimeoutError } from 'ky'
import { ipc } from './general.js'
import type { launchCredentials } from 'xlicore'
import type { accountInfo } from '../stores/params.svelte.js'

export async function execLogin(username: string, password: string) {
  try {
    const apiLogin: DraslApiLoginResponse = await ky
      .post(import.meta.env.VITE_AUTH_HOST + '/drasl/api/v2/login', {
        json: { username, password }
      })
      .then((res) => res.json())

    ipc.send('loginrequest', { username, password })
    return new Promise<accountInfo>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('timeout'))
      }, 7000)

      let ret: null | accountInfo = null
      ipc.once('loginresponse', (_event, { launchCredentials }: { launchCredentials: launchCredentials }) => {
        if (!launchCredentials.uuid) reject(new Error('nouuid'))
        ret = {
          ...launchCredentials,
          ...apiLogin
        }
        clearTimeout(timeout)
        resolve(ret)
      })
    })
  } catch (err) {
    if (err instanceof TimeoutError) {
      throw new Error('timeout')
    }
    throw err
  }
}

export type DraslApiLoginResponse = {
  user: {
    isAdmin: boolean
    isLocked: boolean
    uuid: string
    username: string
    preferredLanguage: string
    players: {
      userUuid: string
      name: string
      uuid: string
      offlineUuid: string
      fallbackPlayer: string
      skinModel: string
      skinUrl: string
      capeUrl: string
      createdAt: string
      nameLastChangedAt: string
    }[]
    maxPlayerCount: number
  }
  token: string
}
