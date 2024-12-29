<script lang="ts" module>
  import StatusBar from '../components/StatusBar.svelte'
  import StatusFeed from '../components/StatusFeed.svelte'
  import { route } from '../stores/route.svelte.js'
  import { params } from '../stores/params.js'
  import type { StatusBarContents } from '../types/statusbar.js'
  import { get } from 'svelte/store'
  import { ipc } from '../shared/general.js'
  let statusBar, statusFeed

  let buttonsLocked: string[] = []

  // TODO: add skin renderer
  // import { getSkin } from './Main.svelte.js'
  // let skin: string, cape: string
  // if (get(params).launchCredentials.uuid) {
  //   let skinval = await getSkin()
  //   skin = skinval.skin
  //   cape = skinval.cape
  // }

  function lockHandler(id: string, lock = true): void {
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

    lockHandler('launch', true)
    let opts: StatusBarContents = {
      fillcolor: 'fa0'
    }
    statusBar.sendStatus(opts)
    ipc.send('launch', { params: paramsPass })
  }

  ipc.on('close', () => {
    setTimeout(() => {
      lockHandler('launch', false)
    }, 3000)
  })
</script>

<div class="main">
  <button onclick={launchGame} class="start">Start</button>
  <button onclick={() => ($route.overlay.current = 'settings')}>Settings</button>
  <!-- <button onclick={() => ($route.overlay.current = 'login')}>Login</button> -->
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
