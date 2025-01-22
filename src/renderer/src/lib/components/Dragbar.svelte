<script lang="ts">
  import { X, Minus, Bug, Download } from 'lucide-svelte'
  import { ipc } from '../scripts/general.js'
  import { _, isLoading } from 'svelte-i18n'
  import { route } from '../stores/route.svelte.js'
  import { fade } from 'svelte/transition'

  let updateFound = $state(false)

  function quit(): void {
    ipc.send('quit')
  }
  function minimize(): void {
    ipc.send('minimize')
  }
  function report(): void {
    if ($route.overlay.current == 'feedback') return
    $route.overlay.previous = $route.overlay.current
    $route.overlay.current = 'feedback'
  }
  function update(): void {
    ipc.send('installupdate')
  }

  ipc.on('updatefound', () => {
    updateFound = true
  })
</script>

<div class="dragbar">
  {#if !$isLoading && $route.loaded}
    <div class="text" transition:fade={{ duration: 200 }}>
      <p>{$_('dragbar.title')} • {$_('dragbar.edition')} {import.meta.env.APP_VERSION}</p>
    </div>
    <div class="buttons" transition:fade={{ duration: 200 }}>
      {#if updateFound}
        <button class="update" data-title={$_('dragbar.tooltips.buttons.update')} onclick={update}><Download /></button>
      {/if}
      <button class="report" data-title={$_('dragbar.tooltips.buttons.bugs')} onclick={report}><Bug /></button>
      <button class="right minimize" data-title={$_('dragbar.tooltips.buttons.minimize')} onclick={minimize}><Minus /></button>
      <button class="right close" data-title={$_('dragbar.tooltips.buttons.close')} onclick={quit}><X /></button>
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

        &:hover::after {
          content: attr(data-title);
          width: max-content;
          position: absolute;
          bottom: -1.5rem;
          font-size: 0.8rem;
          line-height: 1;
          background-color: var(--color-background);
          color: var(--color-text-primary);
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

        &.update {
          color: #88f;
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
