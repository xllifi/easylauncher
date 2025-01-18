<script lang="ts">
  import { route } from '../../stores/route.svelte.js'
  import { params } from '../../stores/params.svelte.js'
  import { ipc } from '../../scripts/general.js'
  import { onMount } from 'svelte'
  import * as skinview3d from 'skinview3d'
  import { getSkinUrls, setupSkin } from './Main.svelte.js'
  import noskin from '../../../assets/unknownplayer.png'
  import BgLogs from './BgLogs.svelte'
  import { PackageSearch, ScrollText, Settings2 } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'
  let skinCv: HTMLCanvasElement, skinVw: skinview3d.SkinViewer
  let skin: string = noskin
  let cape: string
  let skinLoaded: boolean = false

  function resizeCv(cv: HTMLCanvasElement, sw: skinview3d.SkinViewer) {
    if (!cv || !sw) return
    let height = window.innerHeight
    let width = height / 1.25

    if (width / window.innerWidth > 1 / 2) {
      width = (window.innerWidth * 1) / 2
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
    if ($route.state == 'launch') return
    ipc.send('launch', { params: $params })
    $route.state = 'launch'
  }

  ipc.on('start', () => {
    if ($route.state === 'launch') {
      $route.state = 'idle'
    }
  })

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
<BgLogs />
<div class="main">
  <div class="bottom">
    <p class="username">{$params.launchCredentials.name}</p>
    <button class="start" class:disabled={$route.state == 'launch'} onclick={launchGame}>{$_('main.play')}</button>
    <div class="buttons">
      <button class="logs right" data-title={$_('main.tooltips.buttons.modpack')} onclick={() => ipc.send($route.overlay.current = 'modpack')}><PackageSearch /></button>
      <button class="logs right" data-title={$_('main.tooltips.buttons.logs')} onclick={() => ipc.send('viewlogs')}><ScrollText /></button>
      <button class="settings right" data-title={$_('main.tooltips.buttons.settings')} onclick={() => ($route.overlay.current = 'settings')}><Settings2 /></button>
    </div>
  </div>
</div>

<style lang="scss">
  .main {
    width: 100%;
    height: calc(100% - 2rem);

    display: grid;
    grid-template-rows: auto 2rem;

    position: relative;
    pointer-events: none;

    * {
      pointer-events: all;
    }

    .bottom {
      grid-row: 2;
      width: 100dvw;
      background-color: var(--color-background-lighter);

      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      button.start {
        scale: 1.4;
        top: -0.6rem;
        position: relative;

        font-family: Unbounded;
        font-weight: 700;
        font-size: 1rem;
        padding-bottom: 0.15rem;
        background-color: #5f5;
        color: var(--color-background);
        outline: none;
        filter: drop-shadow(0 0 5px #5f53);
        transform-origin: bottom;

        transition:
          scale 100ms ease-out,
          transform 100ms ease-out,
          filter 100ms ease-out;

        &:hover {
          transform: scale(1.08);
          filter: drop-shadow(0 0 8px #5f53);
        }
        &.disabled {
          scale: 1.3;
          background-color: mix(#5f5, #222, 5%);
          filter: none;
          pointer-events: none;

          // keeping for correct animation after disabling
          &:hover {
            scale: 1.3;
            transform: none;
          }
        }
      }

      p.username {
        position: absolute;
        left: 1rem;
        opacity: 0.4;
        user-select: text;

        transition: opacity 200ms;

        &:hover {
          opacity: 1;
        }
      }

      div.buttons {
        position: absolute;
        right: 0;
        bottom: 1px;

        display: flex;

        button {
          width: 2rem;
          height: 2rem;

          padding: 0.4rem;
          margin: 0;

          border: none;
          border-radius: 0;
          outline: none;
          background-color: transparent;
          color: var(--color-text-primary);
          cursor: pointer;
          opacity: 0.4;
          filter: none;

          transition: opacity 100ms;

          &:hover::after {
            content: attr(data-title);
            width: max-content;
            position: absolute;
            top: -1.5rem;
            font-size: 0.8rem;
            line-height: 1;
            background-color: var(--color-background);
            padding: 0.2rem 0.3rem;
            padding-top: 0.3rem;
            box-shadow: 0 0 8px #0006;
            border: solid 1px #fff2;
            border-radius: 0.4rem;
            animation: 1s appearDelay;
            pointer-events: none;
            z-index: 5;
          }
          &.right:hover::after {
            right: 0.2rem;
          }

          @keyframes appearDelay {
            0% {
              opacity: 0;
            }
            99% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          &:is(:hover, :focus-visible) {
            opacity: 1;
          }
        }
      }
    }
  }

  .skin {
    opacity: 1;
    position: absolute;
    left: -2.5rem;
    bottom: 1rem;

    transition: opacity 500ms;

    &.hidden {
      opacity: 0;
    }
  }
</style>
