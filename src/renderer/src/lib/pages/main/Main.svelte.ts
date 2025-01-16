import ky from 'ky'
import { get } from 'svelte/store'
import { params } from '../../stores/params.svelte.js'
import type { SkinViewer } from 'skinview3d'
import * as THREE from 'three'

export async function getSkinUrls() {
  const uuid = get(params).launchCredentials.uuid
  console.log(`Getting skin for UUID ${uuid}`)
  if (!uuid) return {} as getSkinReturn

  const skin: sessionResp = await ky.get(`https://testauth.xllifi.ru/session/minecraft/profile/${uuid}`, { timeout: 3000 }).json()
  const skinvalues: texturesValue = JSON.parse(atob(skin.properties.filter((x) => x.name == 'textures')[0].value))

  return {
    skin: skinvalues.textures.SKIN ? skinvalues.textures.SKIN.url : null,
    cape: skinvalues.textures.CAPE ? skinvalues.textures.CAPE.url : null
  }
}

export async function setupSkin(skinVw: SkinViewer) {
  const player = skinVw.playerObject
  player.rotateY(0.45)

  const cam = skinVw.camera
  cam.position.z = 28
  const ctrl = skinVw.controls
  ctrl.target.set(0, 7, 0)
  ctrl.enableDamping = true
  ctrl.enablePan = false
  ctrl.enableZoom = false
  ctrl.minPolarAngle = 1.65
  ctrl.maxPolarAngle = 1.65

  const renderer = skinVw.renderer
  let lastInteractTimestamp = 0
  let smoothReset: boolean = false
  ctrl.addEventListener('start', onStart)
  ctrl.addEventListener('end', onEnd)

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
  renderer.setAnimationLoop(animate)

  // Dramatic lights
  skinVw.globalLight.visible = false
  const rectLight = new THREE.RectAreaLight(0x404040, 20, 20, 40)
  rectLight.position.set(-9, 0, -27)
  rectLight.lookAt(0, 0, -27)
  cam.add(rectLight)

  const light = new THREE.PointLight(0xffffff, 60)
  light.position.set(12, 8, -18)
  cam.add(light)
}

// Types

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
