import ky from "ky"
import { get } from "svelte/store"
import { params } from "../stores/params.js"

export async function getSkinUrls() {
  let ret: getSkinReturn
  try {
    const skin: sessionResp = await ky.get(`https://testauth.xllifi.ru/session/minecraft/profile/${get(params).launchCredentials.uuid}`, {
      timeout: 3000
    }).json()
    const skinvalues: texturesValue = JSON.parse(atob(skin.properties.filter((x) => x.name == 'textures')[0].value))

    ret = {
      skin: skinvalues.textures.SKIN ? skinvalues.textures.SKIN.url : null,
      cape: skinvalues.textures.CAPE ? skinvalues.textures.CAPE.url : null
    }
  } catch {
    ret = {} as getSkinReturn
  }
  return ret
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
