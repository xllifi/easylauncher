<script lang="ts">
  import StatusBar from './components/StatusBar.svelte'
  import StatusFeed from './components/StatusFeed.svelte'
  import type { StatusBarContents } from './types/statusbar'
  let statusBar
  let username: string = ''

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
    console.log('starting download')
    if (buttonsLocked.includes('download')) {
      console.log('download already')
      return
    }

    if (!/[a-zA-Z0-9_]{3,16}/.test(username)) {
      console.log('bad username! ' + username)
      let opts: StatusBarContents = {
        text: 'Никнейм некорректен!',
        fillcolor: 'd44',
        progress: 100,
        hide_after_secs: 3
      }
      statusBar.sendStatus(opts)
      return
    }

    lockHandler('download', true)
    let opts: StatusBarContents = {
      fillcolor: 'fa0'
    }
    statusBar.sendStatus(opts)
    ipc.send('install', { username })
  }
  ipc.on('close', () => {
    lockHandler('download', false)
  })
</script>

<div class="main">
  <input bind:value={username} placeholder="Никнейм" />
  <button on:click|self={startDownload} class="start">Start</button>
  <StatusBar bind:this={statusBar} />
  <!-- <StatusFeed /> -->
</div>

<style lang="scss">
  .main {
    width: 100%;
    height: 100%;

    display: flex;

    justify-content: center;
    align-items: center;

    position: relative;
  }
</style>
