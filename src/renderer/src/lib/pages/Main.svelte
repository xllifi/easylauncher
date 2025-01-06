<script lang="ts">
  import StatusBar from '../components/StatusBar.svelte'
  import StatusFeed from '../components/StatusFeed.svelte'
  import { route } from '../stores/route.svelte.js'
  import { params } from '../stores/params.svelte.js'
  import type { StatusBarContents } from '../types/statusbar.js'
  import { get } from 'svelte/store'
  import { ipc } from '../scripts/general.js'
  import { onMount } from 'svelte'
  import * as skinview3d from 'skinview3d'
  import { getSkinUrls } from './Main.svelte.js'
  import * as THREE from 'three'
  import noskin from '../../assets/unknownplayer.png'
  let statusBar, skinCv: HTMLCanvasElement, skinVw: skinview3d.SkinViewer
  let skin: string = noskin
  let cape: string
  let skinLoaded: boolean = false

  function resizeCv(cv: HTMLCanvasElement, sw: skinview3d.SkinViewer) {
    if (!cv || !sw) return
    const height = window.innerHeight
    const width = height / 1.3

    cv.width = width
    cv.height = height
    sw.width = width
    sw.height = height
  }

  async function setSkin() {
    let skinval = await getSkinUrls()
    if (skinval.skin) skin = skinval.skin
    if (skinval.cape) cape = skinval.cape

    skinVw = new skinview3d.SkinViewer({
      canvas: skinCv,
      skin,
      cape,
      animation: new skinview3d.IdleAnimation(),
      pixelRatio: window.devicePixelRatio * 2
    })

    // Scene settings

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

    // Render
    resizeCv(skinCv, skinVw)
    window.addEventListener('resize', () => {
      resizeCv(skinCv, skinVw)
    })

    skinLoaded = true
  }
  async function changeSkin(retriesLeft?: number) {
    skinLoaded = false
    let skinval = await getSkinUrls()
    if (skinval.skin) {
      skin = skinval.skin
    } else {
      skin = noskin
    }
    skinVw.loadSkin(skin)

    if (skinval.cape) {
      cape = skinval.cape
      skinVw.loadCape(cape)
    } else {
      skinVw.resetCape()
    }

    if ((!window.navigator.onLine || skin == noskin) && retriesLeft && retriesLeft > 0) {
      setTimeout(() => {
        changeSkin(retriesLeft ? retriesLeft - 1 : 2)
      }, 250)
      return
    }

    skinLoaded = true
  }

  let buttonsLocked: string[] = []

  function lockHandler(id: string, lock = true): void {
    if (lock) {
      buttonsLocked.push(id)
    } else {
      let index = buttonsLocked.indexOf(id)
      if (index >= 0) {
        buttonsLocked.splice(index, 1)
      }
    }
  }

  function launchGame(): void {
    if (buttonsLocked.includes('launch')) {
      return
    }

    let paramsPass = get(params)

    lockHandler('launch', true)
    let opts: StatusBarContents = {
      fillcolor: 'fa0'
    }
    statusBar.sendStatus(opts)
    ipc.send('launch', { params: paramsPass })
  }

  ipc.on('close', () => {
    setTimeout(() => {
      lockHandler('launch', false)
    }, 3000)
  })
  ipc.on('loginresponse', async (_event, { launchCredentials }) => {
    $params.launchCredentials = launchCredentials

    setTimeout(() => {
      changeSkin()
    }, 500)
  })
  onMount(() => {
    setSkin()
  })
</script>

<svelte:window
  ononline={() => {
    setTimeout(() => {
      changeSkin()
    }, 2000)
  }}
/>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<canvas class="skin" class:noskin={skin == noskin} class:hidden={!skinLoaded} bind:this={skinCv} />
<div class="main">
  <button onclick={launchGame}>Start</button>
  <button onclick={() => ($route.overlay.current = 'settings')}>Settings</button>
  <!-- <button onclick={() => ($route.overlay.current = 'login')}>Login</button> -->
  <StatusBar bind:this={statusBar} />
  <StatusFeed />
</div>

<style lang="scss">
  .main {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    pointer-events: none;

    * {
      pointer-events: all;
    }
  }

  .skin {
    opacity: 1;
    position: absolute;
    left: -8dvw;
    bottom: 0;

    transition: opacity 500ms;

    &.hidden {
      opacity: 0;
    }
  }
</style>
