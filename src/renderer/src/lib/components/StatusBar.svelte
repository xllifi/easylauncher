<script lang="ts">
  let ipc = window.electron.ipcRenderer

  let text, small_text, progress, finishAnimTimeout
  let hide = true
  let fillcolor = 'fa0'

  async function parseMessage(taskname: string): Promise<string> {
    console.log(taskname)
    switch (true) {
      case taskname === 'jar':
        return 'Загрузка основного файла...'
      case ['version', 'json', 'assets', 'assetIndex'].includes(taskname):
        return 'Загрузка метаданных...'
      case ['library', 'libraries', 'dependencies'].includes(taskname):
        return 'Загрузка библиотек...'
      case ['asset', 'assets'].includes(taskname):
        return 'Загрузка ресурсов...'
      default:
        return 'Загрузка...'
    }
  }

  export function downloadStatus(): void {
    hide = false
    text = 'Загрузка начинается...'
    small_text = ''
    fillcolor = 'fa0'
    progress = 0
  }
  ipc.on('start', async (_event, { taskname }) => {
    console.log('Got start')
    hide = false
    text = taskname
    small_text = ''
    fillcolor = 'fa0'
    progress = 0

    clearTimeout(finishAnimTimeout)
  })
  ipc.on('update', async (_event, { taskname, small, percent }) => {
    console.log('Got update')
    hide = false
    text = await parseMessage(taskname)
    small_text = small
    progress = percent
    fillcolor = 'fa0'

    clearTimeout(finishAnimTimeout)
  })
  ipc.on('fail', (_event, { message }) => {
    console.log('Got error')
    console.error(message)
    text = `Ошибка: ${message}`
    small_text = ''
    progress = 100
    fillcolor = 'f55'
  })
  ipc.on('success', async (_event, { message }) => {
    console.log('Got success')
    hide = false
    text = `Успех: ${message}`
    small_text = ''
    progress = 100
    fillcolor = 'afa'
    finishAnimTimeout = setTimeout(() => {
      hide = true
      finishAnimTimeout = setTimeout(() => {
        progress = undefined
        fillcolor = 'fa0'
      }, 500)
    }, 2500)
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
    border-radius: 0 0 0.5rem 0.5rem;
    overflow: hidden;

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
