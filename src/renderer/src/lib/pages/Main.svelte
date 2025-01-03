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
  import noskin from '../../assets/unknownplayer.png'
  let statusBar, skinCv: HTMLCanvasElement, skinVw: skinview3d.SkinViewer
  let skin: string = noskin
  let cape: string
  let skinLoaded: boolean = false

  function resizeCv(cv: HTMLCanvasElement, sw: skinview3d.SkinViewer) {
    const height = window.innerHeight
    const width = height / 2

    cv.width = width
    sw.width = width
    cv.height = height
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
      animation: new skinview3d.IdleAnimation()
    })

    const cam = skinVw.camera
    cam.position.set(-20, 3, 28)
    const ctrl = skinVw.controls
    ctrl.target.set(0, 7, 0)
    ctrl.enableDamping = true
    ctrl.enablePan = false
    ctrl.enableZoom = false
    ctrl.minPolarAngle = 1.65
    ctrl.maxPolarAngle = 1.65

    resizeCv(skinCv, skinVw)
    window.addEventListener('resize', () => {
      resizeCv(skinCv, skinVw)
    })

    skinLoaded = true
  }
  async function changeSkin(retriesLeft?: number) {
    skinLoaded = false
    let skinval = await getSkinUrls()
    if (skinval.skin) skin = skinval.skin
    else skin = noskin
    if (skinval.cape) cape = skinval.cape

    skinVw.loadSkin(skin)
    skinVw.loadCape(cape)

    if ((!window.navigator.onLine || skin == noskin) && (retriesLeft && retriesLeft > 0)) {
      return changeSkin(retriesLeft ? retriesLeft - 1 : 2)
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

<svelte:window ononline={() => {
  setTimeout(() => {
    changeSkin()
  }, 2000);
}} />

<!-- svelte-ignore element_invalid_self_closing_tag -->
<canvas class="skin" class:noskin={skin == noskin} class:hidden={!skinLoaded} bind:this={skinCv} />
<div class="main">
  <button onclick={launchGame} class="start">Start</button>
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
    left: 0;
    bottom: 0;

    transition: opacity 500ms;

    filter: brightness(50%);
    &.hidden {
      opacity: 0;
    }
  }
</style>
