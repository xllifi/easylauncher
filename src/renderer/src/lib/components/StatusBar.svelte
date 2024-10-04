<script lang="ts">
  let ipc = window.electron.ipcRenderer
  
  let text, progress
  let hide = true
  let fillcolor = '5f5'

  export function downloadStatus() {
    text = 'Загрузка начинается...'
    progress = 0
    fillcolor = '5f5'
    hide = false
  }
  ipc.on('download-progress', async (_event, { name, percent }) => {
    console.log(percent)
    progress = Math.round(percent)
    text = `Прогресс загрузки «${name}» - ${progress}%`
  })
  ipc.on('download-fail', (_event, {error}) => {
    text = `Ошибка: ${error}`
    progress = 100
    fillcolor = 'f55'
  })
  ipc.on('download-end', () => {
    fillcolor = 'fff'
    setTimeout(() => {
      hide = true
      setTimeout(() => {
        progress = undefined
        fillcolor = '5f5'
      }, 500)
    }, 600)
  })
</script>

<div class="progressbarwrapper">
  <div class="progressbar" class:hidden={hide}>
    <clipPath class="fill" id="fill" style="width: {progress == null ? 0 : progress}%; background-color: #{fillcolor};"></clipPath>
    <p class="label over-fill" style="clip-path: polygon(0% 0%, 0% 100%, {progress == null ? 0 : progress}% 100%, {progress == null ? 0 : progress}% 0%);">{text}</p>
    <p class="label over-bg">{text}</p>
  </div>
</div>

<style lang="scss">
  .progressbarwrapper {
    width: 100%;
    height: 2rem;

    position: absolute;
    bottom: 0;

    overflow: hidden;
  }
  .progressbar {
    width: 100%;
    height: 2rem;

    position: absolute;
    bottom: 0;

    background-color: #000;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: bottom 500ms;

    &.hidden {
      bottom: -2rem;
    }

    .label {
      position: absolute;
      font-family: Roboto Flex;
      font-weight: 800;
      width: 100%;
      text-align: center;
      transition: clip-path 200ms ease-in-out;
      text-wrap: nowrap;

      &.over-bg {
        color: var(--color-text-primary);
        z-index: 0;
      }
      &.over-fill {
        color: var(--color-background);
        z-index: 2;
      }
    }
    .fill {
      left: 0;
      position: absolute;
      height: 100%;
      z-index: 1;

      transition:
        width 200ms ease-in-out,
        background-color 200ms;
    }
  }
</style>
