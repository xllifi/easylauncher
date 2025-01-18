<script lang="ts">
  import { X, Minus, Bug } from 'lucide-svelte'
  import { ipc } from '../scripts/general.js'
  import { _, isLoading } from 'svelte-i18n'
  import { route } from '../stores/route.svelte.js'
  import { fade } from 'svelte/transition'

  function quit(): void {
    ipc.send('quit')
  }
  function minimize(): void {
    ipc.send('minimize')
  }
  function report(): void {
    ipc.send('report')
  }
</script>

<div class="dragbar">
  <div class="text">
    {#if !$isLoading && $route.loaded}
      <p transition:fade={{duration: 200}}>{$_('dragbar.title')} • {$_('dragbar.edition')}</p>
    {/if}
  </div>
  <div class="buttons">
    <button class="report" on:click|stopPropagation={report}><Bug width="18px" height="18px" /></button>
    <button class="minimize" on:click|stopPropagation={minimize}><Minus width="18px" height="18px" /></button>
    <button class="close" on:click|stopPropagation={quit}><X width="18px" height="18px" /></button>
  </div>
</div>

<style lang="scss">
  @import '../../assets/base.scss';

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
      color: var(--color-border);
    }
    .buttons {
      display: inline-flex;
      flex-direction: row;
      margin-left: auto;

      button {
        -webkit-app-region: no-drag;
        position: relative;
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

        transition: opacity 100ms, color 100ms;

        &:is(:hover, :focus-visible) {
          opacity: 1;
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
