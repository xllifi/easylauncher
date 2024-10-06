<script lang="ts">
  import StatusBar from './components/StatusBar.svelte'
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
    if (!buttonsLocked.includes('download')) {
      lockHandler('download')
      statusBar.downloadStatus()
      setTimeout(() => {
        ipc.send('install')
      }, 500)
    }
  }
  ipc.on('fail', () => {
    lockHandler('download', false)
  })
  ipc.on('success', () => {
    lockHandler('download', false)
  })
</script>

<p>Start (xllifi)</p>
<button on:click|self={startDownload}>Start</button>

<StatusBar bind:this={statusBar} />
