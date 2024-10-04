<script lang="ts">
  
  let ipc = window.electron.ipcRenderer

  let downloadName, downloadProgress = ''

  function startDownload() {
    ipc.send('download')
  }

  ipc.on('downloadprogress', (name, percent) => {
    downloadName = name
    downloadProgress = percent
  })
</script>

<form>
  <p>Start game</p>
  <input type="text" name="username" id="username" />
  <button>Submit</button>
</form>

<p>Download</p>
<button on:click|self={startDownload}>Start</button>

{#if downloadName != '' && downloadProgress != ''}
  <p>{downloadName}: {downloadProgress}</p>
{/if}