<script lang="ts">
  import { X, Minus } from 'lucide-svelte'

  let ipc = window.electron.ipcRenderer

  function quit(): void {
    ipc.send('quit')
  }
  function minimize(): void {
    ipc.send('minimize')
  }
</script>

<div class="dragbar">
  <div class="text">
    <p>easylauncher • пре-αльфа</p>
  </div>
  <div class="buttons">
    <span class="divider"></span>
    <button class="minimize" on:click|stopPropagation={minimize}><Minus /></button>
    <span class="divider"></span>
    <button class="close" on:click|stopPropagation={quit}><X /></button>
  </div>
</div>

<style lang="scss">
  @import '../../assets/base.scss';

  .dragbar {
    z-index: 100;

    position: relative;
    -webkit-app-region: drag;
    height: 1.5rem;
    width: 100%;
    background-color: var(--color-background-lighter);

    display: flex;
    flex-direction: row;

    .divider {
      width: 1.1px;
      height: 1.5rem;
      background-color: var(--color-text-darker);
    }
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      height: 1.1px;
      width: 100%;
      background-color: var(--color-text-darker);
    }

    .text {
      display: inline-flex;
      flex-direction: row;

      font-family: Inter;
      font-weight: 500;

      height: 1.5rem;
      align-items: center;

      padding-left: 0.5rem;
      color: var(--color-text-darker);
    }
    .buttons {
      display: inline-flex;
      flex-direction: row;
      margin-left: auto;

      height: 1.5rem;

      button {
        -webkit-app-region: no-drag;
        position: relative;
        width: 2rem;
        height: 1.5rem;
        padding: 0.25rem;

        border: none;
        background-color: transparent;

        transition: background-color 100ms;

        :global(.lucide) {
          width: 100%;
          height: 100%;
          position: relative;
          top: 0.5px;
          right: 0.5px;
          color: var(--color-text-primary);
          // transition:
          //   transform 100ms ease-in-out,
          //   filter 200ms ease-in-out;
        }

        &:hover :global(.lucide) {
          transform: scale(1.1);
          color: #000;
        }

        &:active :global(.lucide) {
          transform: scale(1);
        }
      }
      .close {
        border-radius: 0 0.5rem 0 0;
        &:hover {
          background-color: #f44c;
        }
      }
      .minimize:hover {
        background-color: #fffb;
      }
    }
  }
</style>
