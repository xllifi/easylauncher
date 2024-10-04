<script lang="ts">
  import StatusBar from './components/StatusBar.svelte'

  let ipc = window.electron.ipcRenderer

  let downloadText: string, downloadProgress: number

  let buttonsLocked = []

  function startDownload(): void {
    if (!buttonsLocked.includes('download')) {
      buttonsLocked.push('download')
      downloadText = `Загрузка начинается...`
      setTimeout(() => {
        ipc.send('download')
      }, 500)
    }
  }
  ipc.on('download-end', () => {
    let i = buttonsLocked.indexOf('download')
    if (i >= 0) {
      buttonsLocked.splice(i, 1)
    }
  })
</script>

<form>
  <p>Start game</p>
  <input type="text" name="username" id="username" />
  <button>Submit</button>
</form>

<p>Download</p>
<button on:click|self={startDownload}>Start</button>

<StatusBar text={downloadText} progress={downloadProgress}/>
