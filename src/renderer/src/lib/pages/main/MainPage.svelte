<script lang="ts">
  import { route } from '../../stores/route.svelte.js'
  import { params } from '../../stores/params.svelte.js'
  import { ipc } from '../../scripts/general.js'
  import { onMount } from 'svelte'
  import * as skinview3d from 'skinview3d'
  import { getSkinUrls, setupSkin } from './Main.svelte.js'
  import noskin from '../../../assets/unknownplayer.png'
  import BgLogs from './BgLogs.svelte'
  import { Cog, FolderOpen, Package, ScrollText } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'
  import { appstate } from '../../stores/appstate.svelte.js'
  import { tooltip } from '../../actions/tooltip.svelte.js'
  import SettingsModal from '../../modals/settings/SettingsModal.svelte'
  import ModpackModal from '../../modals/ModpackModal.svelte'
  import RulesModal from '../../modals/RulesModal.svelte'
  let skinCv: HTMLCanvasElement, skinVw: skinview3d.SkinViewer
  let skin: string = $state(noskin)
  let cape: string
  let skinLoaded: boolean = $state(false)

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
    if ($appstate.current == 'launch') return

    if (!$params.rulesConfirmed || true) {
      $route.modal.current = RulesModal
      const unsub = params.subscribe(({rulesConfirmed}) => {
        if (rulesConfirmed) {
          unsub()
          launchGame()
        }
      })
      return
    }

    ipc.send('launch', { params: $params })
    $appstate.current = 'launch'
  }

  function stopGame(): void {
    ipc.send('stopgame', { params: $params })
  }

  ipc.on('loginresponse', () => changeSkin())
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
    <button class="start" class:disabled={$appstate.current == 'launch' || $appstate.minecraftPids.length > 0} onclick={launchGame}>{$_('page.main.play')}</button>
    <button class="stop" class:disabled={$appstate.current == 'launch' || $appstate.minecraftPids.length <= 0} onclick={stopGame}>{$_('page.main.stop')}</button>
    <div class="buttons">
      <button use:tooltip={$_('page.main.tooltips.buttons.gamedir')} onclick={() => ipc.send('opengamedir')}><FolderOpen /></button>
      <button use:tooltip={$_('page.main.tooltips.buttons.logs')} onclick={() => ipc.send('viewlogs')}><ScrollText /></button>
      <button use:tooltip={$_('page.main.tooltips.buttons.modpack')} onclick={() => ($route.modal.current = ModpackModal)}><Package /></button>
      <button use:tooltip={$_('page.main.tooltips.buttons.settings')} onclick={() => ($route.modal.current = SettingsModal)}><Cog /></button>
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

      button:is(.start, .stop) {
        top: -0.6rem;
        position: absolute;

        z-index: 2;

        font-family: Unbounded;
        font-weight: 700;
        font-size: 1rem;
        padding-bottom: 0.15rem;
        color: var(--color-background);
        outline: none;
        transform-origin: bottom;

        transition:
          opacity 500ms,
          scale 100ms ease-out,
          transform 100ms ease-out,
          filter 100ms ease-out;

        &.start {
          scale: 1.4;
          background-color: #5f5;
          filter: drop-shadow(0 0 8px #5f53);
          &:hover {
            filter: drop-shadow(0 0 8px #5f53);
          }
        }

        &.stop {
          scale: 1.3;
          background-color: #f55;
          filter: drop-shadow(0 0 8px #f553);
          &:hover {
            filter: drop-shadow(0 0 8px #f553);
          }
        }

        &:hover {
          transform: scale(1.08);
        }
        &.disabled {
          opacity: 0;
          z-index: 1;
          top: -0.2rem;
          background-color: var(--color-background-lighter);
          filter: none;
          pointer-events: none;
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
