<script lang="ts">
  import { X, Minus, Bug } from 'lucide-svelte'

  let ipc = window.electron.ipcRenderer

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
    <p>easylauncher • пре-αльфа</p>
  </div>
  <div class="buttons">
    <span class="divider"></span>
    <button class="report" on:click|stopPropagation={report}><Bug width="18px" height="18px" /></button>
    <span class="divider"></span>
    <button class="minimize" on:click|stopPropagation={minimize}><Minus width="18px" height="18px" /></button>
    <span class="divider"></span>
    <button class="close" on:click|stopPropagation={quit}><X width="18px" height="18px" /></button>
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
      background-color: var(--color-border);
    }
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      height: 1.1px;
      width: 100%;
      background-color: var(--color-border);
    }

    .text {
      display: inline-flex;
      flex-direction: row;

      font-family: Inter;
      font-weight: 500;

      height: 1.5rem;
      align-items: center;

      padding-left: 0.5rem;
      color: var(--color-border);
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
        border-radius: 0;

        margin: 0;
        padding: 0;

        border: none;
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
          // transition:
          //   transform 100ms ease-in-out,
          //   filter 200ms ease-in-out;
        }

        &:is(:hover, :focus-visible) {
          outline: none;
          filter: none;
        }

        &:is(:hover, :focus-visible) :global(.lucide) {
          transform: scale(1.1);
          color: #000;
        }

        &:active :global(.lucide) {
          transform: scale(1);
        }
      }
      .close:is(:hover, :focus-visible) {
        background-color: #b33;
      }
      .minimize:is(:hover, :focus-visible) {
        background-color: #ccc;
      }
      .report:is(:hover, :focus-visible) {
        background-color: #33b;
      }
    }
  }
</style>
