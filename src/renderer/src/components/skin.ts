import ky from 'ky'
import { get } from 'svelte/store'
import { params } from '../lib/stores/params.svelte.js'
import type { SkinViewer } from 'skinview3d'

export async function getSkinUrls(): Promise<SkinURLs> {
  const uuid = get(params).shared.launchCredentials.uuid
  console.log(`Getting skin for UUID ${uuid}`)
  if (!uuid) return {} as SkinURLs

  const skin: sessionResp = await ky.get(`${import.meta.env.VITE_AUTH_HOST}/session/minecraft/profile/${uuid}`, { timeout: 10000 }).json()
  const skinvalues: texturesValue = JSON.parse(atob(skin.properties.filter((x) => x.name == 'textures')[0].value))

  return {
    skin: skinvalues.textures.SKIN ? skinvalues.textures.SKIN.url : null,
    cape: skinvalues.textures.CAPE ? skinvalues.textures.CAPE.url : null
  }
}

export function setupSmoothReset(skinVw: SkinViewer) {
  const ctrl = skinVw.controls
  let lastInteractTimestamp = 0
  let smoothReset: boolean = false

  ctrl.addEventListener('start', onStart)
  ctrl.addEventListener('end', onEnd)

  const renderer = skinVw.renderer
  renderer.setAnimationLoop(animate)

  function onStart() {
    ctrl.minAzimuthAngle = -Infinity
    ctrl.maxAzimuthAngle = Infinity
    smoothReset = false
  }
  function onEnd() {
    lastInteractTimestamp = Date.now()
    smoothReset = true
  }
  function animate() {
    if (!smoothReset || lastInteractTimestamp + 1500 > Date.now()) return
    // get current angle
    var alpha = ctrl.getAzimuthalAngle()

    // smooth change using manual lerp
    ctrl.minAzimuthAngle = 0.98 * alpha
    ctrl.maxAzimuthAngle = ctrl.minAzimuthAngle

    // if the reset values are reached, exit smooth reset
    if (alpha == 0) onStart()
  }
}

// Types

export type SkinURLs = {
  skin: string | null,
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
