<script lang="ts">
  import { route } from '../../stores/route.svelte.js'
  import { params } from '../../stores/params.svelte.js'
  import { ipc } from '../../scripts/general.js'
  import { onMount } from 'svelte'
  import * as skinview3d from 'skinview3d'
  import { getSkinUrls, setupSkin } from './Main.svelte.js'
  import noskin from '../../../assets/unknownplayer.png'
  let skinCv: HTMLCanvasElement, skinVw: skinview3d.SkinViewer
  let skin: string = noskin
  let cape: string
  let skinLoaded: boolean = false

  function resizeCv(cv: HTMLCanvasElement, sw: skinview3d.SkinViewer) {
    if (!cv || !sw) return
    let height = window.innerHeight
    let width = height / 1.25

    if (width/window.innerWidth > 1/2) {
      width = window.innerWidth * 1/2
      height = width * 1.25
    }
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

    setupSkin(skinVw)

    // Set correct size
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
    await skinVw.loadSkin(skin)

    if (skinval.cape) {
      cape = skinval.cape
      await skinVw.loadCape(cape)
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

  function launchGame(): void {
    ipc.send('launch', { params: $params })
  }

  ipc.on('loginresponse', async (_event, { launchCredentials }) => {
    $params.launchCredentials = launchCredentials

    changeSkin()
  })
  onMount(() => {
    setSkin()
  })
</script>

<svelte:window ononline={() => changeSkin} />

<!-- svelte-ignore element_invalid_self_closing_tag -->
<canvas class="skin" class:noskin={skin == noskin} class:hidden={!skinLoaded} bind:this={skinCv} />
<div class="main">
  <button onclick={launchGame}>Start</button>
  <button onclick={() => ($route.overlay.current = 'settings')}>Settings</button>
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
    left: -2.5rem;
    bottom: 0;

    transition: opacity 500ms;

    &.hidden {
      opacity: 0;
    }
  }
</style>
