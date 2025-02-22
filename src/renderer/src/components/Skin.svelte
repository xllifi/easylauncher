<script lang="ts">
  import * as skinview3d from 'skinview3d'
  import noskin from '../assets/unknownplayer.png'
  import { type SkinURLs } from './skin.js'
  import { onMount } from 'svelte'

  type Props = {
    canvasSize: () => {width: number, height: number}
    skinSetup?: (skinVw: skinview3d.SkinViewer) => void
  }
  let { canvasSize = $bindable(), skinSetup = $bindable() }: Props = $props()

  let skinCv: HTMLCanvasElement, skinVw: skinview3d.SkinViewer
  let skin: string = $state(noskin)
  let cape: string
  let skinLoaded: boolean = $state(false)

  function resizeCv(cv: HTMLCanvasElement, sw: skinview3d.SkinViewer) {
    if (!cv || !sw) return
    const dims = canvasSize()
    if (!dims.height || !dims.width) return

    sw.width = dims.width
    sw.height = dims.height
  }

  export async function setSkin(skinURLs: SkinURLs, retriesLeft?: number) {
    skinLoaded = false
    skin = skinURLs.skin || noskin
    skinVw.loadSkin(skin)

    if (skinURLs.cape) {
      cape = skinURLs.cape
      skinVw.loadCape(cape)
    } else {
      skinVw.resetCape()
    }

    if ((!window.navigator.onLine || skin == noskin) && retriesLeft && retriesLeft > 0) {
      setTimeout(() => {
        setSkin(skinURLs, retriesLeft ? retriesLeft - 1 : 2)
      }, 250)
      return
    }

    skinLoaded = true
  }

  onMount(() => {
    skinVw = new skinview3d.SkinViewer({
      canvas: skinCv,
      skin,
      cape,
      animation: new skinview3d.IdleAnimation(),
      pixelRatio: window.devicePixelRatio * 2
    })

    // Set correct size
    resizeCv(skinCv, skinVw)
    window.addEventListener('resize', () => {
      resizeCv(skinCv, skinVw)
    })

    if (skinSetup) skinSetup(skinVw)

    skinLoaded = true
  })
</script>

<!--
@component
You'll have to use `this.setSkin` for the skin to show up.
-->

<canvas class="skin" class:noskin={skin == noskin} class:hidden={!skinLoaded} bind:this={skinCv}></canvas>
