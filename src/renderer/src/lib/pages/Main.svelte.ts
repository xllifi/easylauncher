import ky from "ky"
import { get } from "svelte/store"
import { params } from "../stores/params.js"

export async function getSkin() {
  const skin: sessionResp = await ky.get(`https://testauth.xllifi.ru/session/minecraft/profile/${get(params).launchCredentials.uuid}`).json()
  const skinvalues: texturesValue = JSON.parse(atob(skin.properties.filter((x) => x.name == 'textures')[0].value))

  const ret: getSkinReturn = {
    skin: skinvalues.textures.SKIN.url,
    cape: skinvalues.textures.CAPE.url
  }
  return ret
}

export type getSkinReturn = {
  skin: string
  cape: string
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
