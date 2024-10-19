<script lang="ts">
  let ipc = window.electron.ipcRenderer

  let text, left_text, right_text_1, right_text_2, progress, finishAnimTimeout
  let hide = true
  let fillcolor = 'fa0'
  let minecraft_launched = false

  export function downloadStatus(): void {
    hide = false
    text = 'Ищем файлы...'
    left_text = ''
    fillcolor = 'fa0'
    progress = 0
  }
  ipc.on('start', async () => {
    console.log('Got start')
    hide = false
    text = `Сверяемся с манифестом...`
    left_text = ''
    right_text_1 = ''
    right_text_2 = ''
    fillcolor = 'fa0'
    progress = 0
    
    clearTimeout(finishAnimTimeout)
  })
  ipc.on('extract', (_event, { extract }) => {
    console.log(`Got Extract: ${extract}`)
  })
  ipc.on('progress', async (_event, { element, percent }) => {
    console.log(`Got progress: ${element}, ${percent}`)
    hide = false
    text = `Загрузка: «${element}»`
    left_text = `${percent}%`
    progress = percent
    fillcolor = 'fa0'

    clearTimeout(finishAnimTimeout)
  })
  ipc.on('check', async (_event, { element, percent }) => {
    console.log(`Got check: ${element}, ${percent}`)
    hide = false
    text = `Проверка: «${element}»`
    left_text = `${percent}%`
    progress = percent
    fillcolor = '80f'

    clearTimeout(finishAnimTimeout)
  })
  ipc.on('eta', (_event, { eta }) => {
    console.log(`Got ETA: ${eta}`)
    right_text_2 = `ещё ${eta}`
  })
  ipc.on('speed', (_event, { speed }) => {
    console.log(`Got speed: ${speed}`)
    right_text_1 = speed
  })
  ipc.on('data', async () => {
    console.log('Got data')
    if (minecraft_launched) {
      return
    }
    minecraft_launched = true
    hide = false
    text = `Minecraft запускается...`
    left_text = ''
    right_text_1 = ''
    right_text_2 = ''
    progress = 100
    fillcolor = '5d5'
    finishAnimTimeout = setTimeout(() => {
      hide = true
      finishAnimTimeout = setTimeout(() => {
        progress = undefined
        fillcolor = 'fa0'
      }, 500)
    }, 2500)
  })
  ipc.on('close', () => {
    minecraft_launched = false
  })
</script>

<div class="progressbarwrapper">
  <div class="progressbar" class:hidden={hide}>
    <clipPath class="fill" id="fill" style="width: {progress == null ? 0 : progress}%; background-color: #{fillcolor};"></clipPath>
    <div class="labels top" style="clip-path: polygon(0% 0%, 0% 100%, {progress == null ? 0 : progress}% 100%, {progress == null ? 0 : progress}% 0%);">
      <p class="primary">{text}</p>
      <p class="secondary left">{left_text}</p>
      <p class="secondary right">{right_text_1} {right_text_1 == '' ? '' : '•'} {right_text_2}</p>
    </div>
    <div class="labels bottom">
      <p class="primary">{text}</p>
      <p class="secondary left">{left_text}</p>
      <p class="secondary right">{right_text_1} {right_text_1 == '' ? '' : '•'} {right_text_2}</p>
    </div>
  </div>
</div>

<style lang="scss">
  .progressbarwrapper {
    width: 100%;
    height: 5rem;

    position: fixed;
    bottom: 0;

    overflow: hidden;
  }
  .progressbar {
    height: 2rem;

    position: absolute;
    bottom: .5rem;
    right: .5rem;
    left: .5rem;

    background-color: #000;
    border-radius: 0.2rem;
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
        vertical-align: middle;

        &.left {
          left: 0.5rem;
        }
        &.right {
          right: 0.5rem;
        }
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
