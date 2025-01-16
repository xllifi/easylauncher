<script lang="ts">
  import { X, Minus, Bug } from 'lucide-svelte'
  import { ipc } from '../scripts/general.js'
  import { _ } from 'svelte-i18n'

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
    <p>{$_('dragbar.title')} • {$_('dragbar.prealpha')}</p>
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
        padding: 0;

        border: none;
        border-radius: 0;
        outline: none;
        background-color: transparent;
        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;

        transition: background-color 100ms;

        :global(.lucide) {
          width: 18px;
          height: 18px;
          position: relative;
          padding: 0;
          margin: 0;
          color: var(--color-text-primary);
          opacity: 0.4;
          transition: opacity 100ms color 200ms;
        }

        &:is(:hover, :focus-visible) :global(.lucide) {
          opacity: 1;
        }

        &.report:is(:hover, :focus-visible) :global(.lucide) {
          color: #88f;
        }

        &.minimize:is(:hover, :focus-visible) :global(.lucide) {
          color: #8bb;
        }

        &.close:is(:hover, :focus-visible) :global(.lucide) {
          color: #f88;
        }
      }
    }
  }
</style>
