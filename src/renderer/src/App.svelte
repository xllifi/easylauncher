<script lang="ts">
  import { MonitorX, EyeOff } from 'lucide-svelte'
  import icon from '../../../resources/icon.png'

  let ipc = window.electron.ipcRenderer

  function quit(): void {
    ipc.send('quit')
  }
  function minimize(): void {
    ipc.send('minimize')
  }
</script>

<div class="dragbar">
  <div class="text">
    <img src={icon} alt="app icon" class="icon" />
    <span class="divider"></span>
    <p>Лаунчер</p>
  </div>
  <div class="buttons">
    <span class="divider"></span>
    <button class="minimize" on:click|stopPropagation={minimize}><EyeOff /></button>
    <span class="divider"></span>
    <button class="close" on:click|stopPropagation={quit}><MonitorX /></button>
  </div>
</div>

<style lang="scss">

</style>
