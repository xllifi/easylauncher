<script lang="ts">
  import Settings from './settings/SettingsModal.svelte'
  import StatusBar from './components/StatusBar.svelte'
  import StatusFeed from './components/StatusFeed.svelte'
  import { route } from './stores/route.svelte'
  import { params } from './stores/params.js'
  import type { StatusBarContents } from './types/statusbar.d.ts'
  import type { StatusFeedEntry } from './types/statusfeed.d.ts'
  import { get } from 'svelte/store'
  let statusBar, statusFeed

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

    let paramsPass = get(params)
    if (!/^([a-zA-Z0-9_]){3,16}$/.test(paramsPass.username)) {
      console.log('bad username! ' + paramsPass.username)
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
    ipc.send('launch', { params: paramsPass })
  }

  // function routeTo(page: string): void {
  //   $route.page =
  // }
  ipc.on('close', () => {
    setTimeout(() => {
      lockHandler('launch', false)
    }, 3000);
  })
</script>

<div class="main">
  <button onclick={launchGame} class="start">Start</button>
  <button onclick={() => $route.page = 'settings'}>Settings</button>
  <StatusBar bind:this={statusBar} />
  <StatusFeed bind:this={statusFeed} />
  {#if $route.page == 'settings'}
    <Settings />
  {/if}
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
