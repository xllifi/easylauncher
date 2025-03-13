<script lang="ts">
  import { X, Minus, Bug, Download, Loader, TriangleAlert } from 'lucide-svelte'
  import { ipc } from '../main.js'
  import { _, isLoading } from 'svelte-i18n'
  import { route } from '../lib/stores/route.svelte.js'
  import { fade } from 'svelte/transition'
  import { appstate } from '../lib/stores/appstate.svelte.js'
  import { tooltip } from '../lib/actions/tooltip.svelte.js'
  import { onMount } from 'svelte'
  import FeedbackModal from '../routes/modals/FeedbackModal.svelte'

  let loadingUpdate = $state(false)
  let hideWarn = $state(false)

  function quit(): void {
    ipc.send('quit')
  }
  function minimize(): void {
    ipc.send('minimize')
  }
  function report(): void {
    if ($route.modal.current == FeedbackModal) return
    $route.modal.previous = $route.modal.current
    $route.modal.current = FeedbackModal
  }
  function update(): void {
    loadingUpdate = true
    ipc.send('installupdate')
  }

  ipc.on('cancelupdate', () => {
    loadingUpdate = false
  })

  onMount(() => {
    console.log(`trying to get update status`)
    ipc.send('getupdatestatus')
  })
  ipc.on('updatefound', () => {
    console.log(`got response - found, setting variable`)
    $appstate.updateStatus = 'found'
  })
  ipc.on('updatefailed', () => {
    console.log(`got response - failed, setting variable`)
    $appstate.updateStatus = 'failed'
  })
</script>

<div class="dragbar">
  {#if !$isLoading && $route.loaded}
    <div class="text" transition:fade={{ duration: 200 }}>
      <p>{$_('dragbar.title')} • {$_('dragbar.edition')} {import.meta.env.APP_VERSION}</p>
    </div>
    <div class="buttons" transition:fade={{ duration: 200 }}>
      {#if $appstate.updateStatus}
        {#if $appstate.updateStatus == 'found'}
          <button class="update" class:loading={loadingUpdate} use:tooltip={loadingUpdate ? $_('dragbar.tooltips.buttons.updating') : $_('dragbar.tooltips.buttons.update')} onclick={update}>
            {#if loadingUpdate}
              <Loader />
            {:else}
              <Download />
            {/if}
          </button>
        {:else if $appstate.updateStatus == 'failed'}
          <button class="updatefailed" class:hidden={hideWarn} use:tooltip={$_('dragbar.tooltips.buttons.failedupdate')} onclick={() => hideWarn = true}>
            <TriangleAlert />
          </button>
        {/if}
      {/if}
      <button class="report" use:tooltip={$_('dragbar.tooltips.buttons.bugs')} onclick={report}><Bug /></button>
      <button class="minimize" use:tooltip={$_('dragbar.tooltips.buttons.minimize')} onclick={minimize}><Minus /></button>
      <button class="close" use:tooltip={$_('dragbar.tooltips.buttons.close')} onclick={quit}><X /></button>
    </div>
  {/if}
</div>

<style lang="scss">
  .dragbar {
    z-index: 100;

    position: relative;
    -webkit-app-region: drag;
    height: 2rem;
    width: 100%;
    background-color: var(--color-background-lighter);

    display: flex;
    flex-direction: row;

    .text {
      display: inline-flex;
      flex-direction: row;

      font-family: Inter;
      font-weight: 500;

      align-items: center;

      padding-left: 0.75rem;
      color: var(--color-text-primary);
      opacity: 0.2;
    }
    .buttons {
      display: inline-flex;
      flex-direction: row;
      margin-left: auto;

      button {
        -webkit-app-region: no-drag;
        width: 2rem;
        height: 2rem;

        margin: 0;
        padding: 0.4rem;

        border: none;
        border-radius: 0;
        outline: none;
        background-color: transparent;
        color: var(--color-text-primary);
        filter: none;
        cursor: pointer;
        opacity: 0.4;

        display: flex;
        justify-content: center;
        align-items: center;

        transition:
          opacity 100ms,
          color 100ms;

        &:is(:hover, :focus-visible) {
          opacity: 1;
        }

        &.update {
          color: #88f;

          &.loading > :global(.lucide) {
            animation: infinite loading 6s linear;
          }
          @keyframes loading {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        }

        &.updatefailed {
          color: #f88;

          &.hidden {
            visibility: hidden;
          }
        }

        &.report:is(:hover, :focus-visible) {
          color: #88f;
        }

        &.minimize:is(:hover, :focus-visible) {
          color: #8bb;
        }

        &.close:is(:hover, :focus-visible) {
          color: #f88;
        }
      }
    }
  }
</style>
