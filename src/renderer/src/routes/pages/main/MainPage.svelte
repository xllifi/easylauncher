<script lang="ts">
  import { route } from '../../../lib/stores/route.svelte.js'
  import { params } from '../../../lib/stores/params.svelte.js'
  import { ipc } from '../../../main.js'
  import { onMount, type SvelteComponent } from 'svelte'
  import BgLogs from './BgLogs.svelte'
  import { Cog, FolderOpen, Package, ScrollText } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'
  import { appstate } from '../../../lib/stores/appstate.svelte.js'
  import { tooltip } from '../../../lib/actions/tooltip.svelte.js'
  import SettingsModal from '../../modals/settings/SettingsModal.svelte'
  import ModpackModal from '../../modals/ModpackModal.svelte'
  import RulesModal from '../../modals/RulesModal.svelte'
  import Skin from '../../../components/Skin.svelte'
  import { getSkinUrls, setupSmoothReset } from '../../../components/skin.js'
  import type { SkinViewer } from 'skinview3d'
  import * as THREE from 'three'
  import { createNotification } from '../../../components/StatusFeed.svelte'

  interface Props {
    statusBar: SvelteComponent<any>
  }
  let { statusBar }: Props = $props()

  function launchGame(): void {
    if ($appstate.current == 'launch') return

    if (!$params.successfullLogin) {
      createNotification('launch-error-noprofile')
      return
    }

    if (!$params.rulesConfirmed) {
      $route.modal.current = RulesModal
      const unsub = params.subscribe(({ rulesConfirmed }) => {
        if (rulesConfirmed) {
          unsub()
          launchGame()
        }
      })
      return
    }

    statusBar.setStatus({})
    ipc.send('launch', $params.shared)
    $appstate.current = 'launch'
  }

  let stopTimeout: NodeJS.Timeout = $state() as NodeJS.Timeout
  let confirmStop: boolean = $state(false)

  function stopGame(): void {
    if (!confirmStop) {
      createNotification('confirm-stop')
      confirmStop = true
      stopTimeout = setTimeout(() => {
        confirmStop = false
      }, 30000)
      return
    }

    clearTimeout(stopTimeout)
    confirmStop = false

    ipc.send('stopgame', { params: $params })
  }

  // Skin
  let skinVw
  function canvasSize() {
    let height = window.innerHeight
    let width = height / 1.25

    if (width / window.innerWidth > 1 / 2) {
      width = (window.innerWidth * 1) / 2
      height = width * 1.25
    }

    return { width, height }
  }
  function skinSetup(skinVw: SkinViewer) {
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

    setupSmoothReset(skinVw)

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

  ipc.on('refresh-response', async () => skinVw.setSkin(await getSkinUrls()))
  onMount(async () => {
    skinVw.setSkin(await getSkinUrls())
  })
</script>

<svelte:window ononline={async () => skinVw.setSkin(await getSkinUrls())} />

<div class="skinwrapper">
  <Skin bind:this={skinVw} {canvasSize} {skinSetup} />
</div>
<BgLogs />
<div class="main">
  <div class="bottom">
    <p class="username">{$params.shared.launchCredentials.name}</p>
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

  :global(.skinwrapper .skin) {
    opacity: 1;
    position: absolute;
    left: -2.5rem;
    bottom: 1rem;

    transition: opacity 500ms;
  }
</style>
