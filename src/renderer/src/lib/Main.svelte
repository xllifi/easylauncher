<script lang="ts">
  import StatusBar from './components/StatusBar.svelte'
  import StatusFeed from './components/StatusFeed.svelte'
  import type { StatusBarContents } from './types/statusbar.d'
  import type { StatusFeedEntry } from './types/statusfeed'
  let statusBar, statusFeed
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

  function launchGame(): void {
    console.log('starting launch')
    if (buttonsLocked.includes('launch')) {
      return
    }

    if (!/^([a-zA-Z0-9_]){3,16}$/.test(username)) {
      console.log('bad username! ' + username)
      let opts: StatusFeedEntry = {
        title: 'Никнейм некорректен!',
        description: 'Никнейм должен быть не короче 3 символов и не длиннее 16, а также содержать только латинские символы, цифры и символ _'
      }
      statusFeed.pushEntry(opts)
      return
    }

    lockHandler('launch', true)
    let opts: StatusBarContents = {
      fillcolor: 'fa0'
    }
    statusBar.sendStatus(opts)
    ipc.send('launch', { username })
  }
  ipc.on('close', () => {
    lockHandler('launch', false)
  })
</script>

<div class="main">
  <input bind:value={username} placeholder="Никнейм" />
  <button on:click|self={launchGame} class="start">Start</button>
  <StatusBar bind:this={statusBar} />
  <StatusFeed bind:this={statusFeed} />
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
