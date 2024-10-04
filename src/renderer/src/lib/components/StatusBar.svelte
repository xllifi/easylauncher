<script lang="ts">
  let ipc = window.electron.ipcRenderer

  let text, small_text, progress
  let hide = true
  let fillcolor = '5f5'

  export function downloadStatus(): void {
    text = 'Загрузка начинается...'
    small_text = ''
    progress = 0
    fillcolor = '5f5'
    hide = false
  }
  ipc.on('download-progress', async (_event, { message, small, percent }) => {
    console.log(percent)
    text = message
    small_text = small
    hide = false
    progress = percent
  })
  ipc.on('download-fail', (_event, { error }) => {
    text = `Ошибка: ${error}`
    progress = 100
    fillcolor = 'f55'
  })
  ipc.on('download-success', () => {
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
    <div class="labels top" style="clip-path: polygon(0% 0%, 0% 100%, {progress == null ? 0 : progress}% 100%, {progress == null ? 0 : progress}% 0%);">
      <p class="primary">{text}</p>
      <p class="secondary">{small_text}</p>
    </div>
    <div class="labels bottom">
      <p class="primary">{text}</p>
      <p class="secondary">{small_text}</p>
    </div>
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

    .labels {
      position: absolute;
      width: 100%;
      text-align: center;
      white-space: nowrap;
      transition: clip-path 200ms ease-in-out;

      display: flex;
      align-items: center;

      &.bottom {
        color: var(--color-text-primary);
        z-index: 0;
      }
      &.top {
        color: var(--color-background);
        z-index: 2;
      }
      .primary {
        width: 100%;
        font-family: Unbounded;
        font-weight: 800;
      }
      .secondary {
        position: absolute;
        font-family: Inter;
        font-weight: 500;
        font-size: 0.75rem;
        left: 0.5rem;
        vertical-align: middle;
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
