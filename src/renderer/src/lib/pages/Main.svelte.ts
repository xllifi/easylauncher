import ky from 'ky'
import { get } from 'svelte/store'
import { params } from '../stores/params.svelte.js'

export async function getSkinUrls() {
  const uuid = get(params).launchCredentials.uuid
  if (!uuid) return {} as getSkinReturn

  const skin: sessionResp = await ky.get(`https://testauth.xllifi.ru/session/minecraft/profile/${uuid}`, { timeout: 3000 }).json()
  const skinvalues: texturesValue = JSON.parse(atob(skin.properties.filter((x) => x.name == 'textures')[0].value))

  return {
    skin: skinvalues.textures.SKIN ? skinvalues.textures.SKIN.url : null,
    cape: skinvalues.textures.CAPE ? skinvalues.textures.CAPE.url : null
  }
}

export type getSkinReturn = {
  skin: string | null
  cape: string | null
}

type sessionResp = {
  id: string
  name: string
  properties: [
    {
      name: string
      value: string
    }
  ]
}

type texturesValue = {
  timestamp: number
  profileId: string
  profileName: string
  textures: {
    SKIN: {
      url: string
      metadata: {
        model: string
      }
    }
    CAPE: {
      url: string
    }
  }
}
