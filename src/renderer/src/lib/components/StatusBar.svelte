<script lang="ts">
  export let text, progress

  let ipc = window.electron.ipcRenderer

  ipc.on('downloadprogress', async (_event, { name, percent }) => {
    console.log(percent)
    progress = Math.round(percent)
    text = `Прогресс загрузки «${name}» - ${progress}%`
  })
  ipc.on('download-end', () => {
    setTimeout(() => {
      text = ''
      setTimeout(() => {
        progress = undefined
      }, 500)
    }, 500)
  })
</script>

<div class="progressbarwrapper">
  <div class="progressbar" class:hidden={text == undefined || text == ''}>
    <clipPath class="fill" id="fill" style="width: {progress == null ? 0 : progress}%;"></clipPath>
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
      content: '';
      left: 0;
      position: absolute;
      height: 100%;
      background-color: #5f5;
      z-index: 1;

      transition: width 200ms ease-in-out;
    }
  }
</style>
