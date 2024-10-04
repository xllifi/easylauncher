<script lang="ts">
  import StatusBar from './components/StatusBar.svelte'
  let statusBar

  let ipc = window.electron.ipcRenderer

  let buttonsLocked = []

  function lockHandler(id, lock = true) {
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
      setTimeout(() => { ipc.send('download') }, 500)
    }
  }
  ipc.on('download-fail', () => {
    lockHandler('download', false)
  })
  ipc.on('download-end', () => {
    lockHandler('download', false)
  })
</script>

<form>
  <p>Start game</p>
  <input type="text" name="username" id="username" />
  <button>Submit</button>
</form>

<p>Download</p>
<button on:click|self={startDownload}>Start</button>

<StatusBar bind:this={statusBar}/>
