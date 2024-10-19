<script lang="ts">
  import StatusBar from './components/StatusBar.svelte'
  import StatusFeed from './components/StatusFeed.svelte'
  let statusBar

  let ipc = window.electron.ipcRenderer

  let buttonsLocked = []

  function lockHandler(id, lock = true): void {
    if (lock) {
      buttonsLocked.push(id)
    } else {
      let index = buttonsLocked.indexOf(id)
      if (index >= 0) {
        buttonsLocked.splice(index, 1)
      }
    }
  }

  function startDownload(): void {
    if (buttonsLocked.includes('download')) {
      return
    }

    lockHandler('download', true)
    statusBar.downloadStatus()
    ipc.send('install')
  }
  ipc.on('close', () => {
    lockHandler('download', false)
  })
</script>

<div class="main">
  <button on:click|self={startDownload} class="start">Start</button>
  <StatusBar bind:this={statusBar} />
  <!-- <StatusFeed /> -->
</div>

<style lang="scss">
  .main {
    height: 100%;

    display: flex;

    justify-content: center;
    align-items: center;
  }
</style>
