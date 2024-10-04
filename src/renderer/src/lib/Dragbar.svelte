<script lang="ts">
  import { MonitorX, EyeOff } from 'lucide-svelte'
  import icon from '../../../../resources/icon.png'

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
    <img src={icon} alt="app icon" class="icon" />
    <p>Лаунчер</p>
  </div>
  <div class="buttons">
    <span class="divider"></span>
    <button class="minimize" on:click|stopPropagation={minimize}><EyeOff /></button>
    <span class="divider"></span>
    <button class="close" on:click|stopPropagation={quit}><MonitorX /></button>
  </div>
</div>

<style lang="scss">
  @import '../assets/base.scss';

  .dragbar {
    z-index: 100;

    position: relative;
    -webkit-app-region: drag;
    height: 2rem;
    width: 100%;
    background-color: var(--color-background-lighter);

    display: flex;
    flex-direction: row;

    .divider {
      width: 1px;
      height: 2rem;
      background-color: var(--color-text-darker);
    }
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      height: 1px;
      width: 100%;
      background-color: var(--color-text-darker);
    }

    .text {
      display: inline-flex;
      flex-direction: row;

      height: 2rem;
      align-items: center;

      img {
        height: 100%;
        padding: 0.3rem;
      }

      p {
        padding-left: 0.2rem;
      }
    }
    .buttons {
      display: inline-flex;
      flex-direction: row;
      margin-left: auto;

      height: 2rem;

      button {
        -webkit-app-region: no-drag;
        position: relative;
        width: 2rem;
        height: 2rem;
        padding: 0.4rem;

        border: none;
        background-color: transparent;

        transition: background-color 200ms ease-in-out;

        :global(.lucide) {
          width: 100%;
          height: 100%;
          position: relative;
          top: 0.5px;
          right: 0.5px;
          color: var(--color-text-primary);
          transition:
            transform 200ms ease-in-out,
            filter 400ms ease-in-out;
        }

        &:hover :global(.lucide) {
          transform: scale(1.2);
          color: #000;
        }

        &:active :global(.lucide) {
          transform: scale(1);
        }
      }
      .close {
        border-radius: 0 0.5rem 0 0;
        &:hover {
          background-color: #f55;
        }
      }
      .minimize:hover {
        background-color: #55f;
      }
    }
  }
</style>
