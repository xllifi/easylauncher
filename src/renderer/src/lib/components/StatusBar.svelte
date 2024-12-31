<script lang="ts">
  import { fly } from 'svelte/transition'
  import type { StatusBarContents } from '../types/statusbar.d.ts'
  import { backIn, backOut } from 'svelte/easing'
  import { ipc } from '../scripts/general.js'
  import { _ } from 'svelte-i18n'

  let text, left_text, right_text_1, right_text_2, progress, endTimeout
  let hide = true
  let fillcolor = 'fa0'

  let texts = $_('statusbar.texts')
  let displayText = texts[Math.floor(Math.random() * texts.length)]
  setInterval(() => {
    displayText = texts[Math.floor(Math.random() * texts.length)]
  }, 2500)

  async function parseContents(opts: StatusBarContents): Promise<void> {
    text = opts.text ? opts.text : undefined
    left_text = opts.left_text ? opts.left_text : undefined
    right_text_1 = opts.right_text_1 ? opts.right_text_1 : undefined
    right_text_2 = opts.right_text_2 ? opts.right_text_2 : undefined
    fillcolor = opts.fillcolor ? opts.fillcolor : 'fa0'
    progress = opts.progress ? opts.progress : 0
  }
  async function unsetContents(): Promise<void> {
    hide = true
    setTimeout(() => {
      text = undefined
      left_text = undefined
      right_text_1 = undefined
      right_text_2 = undefined
      fillcolor = 'fa0'
      progress = 0
    }, 400)
  }

  export function sendStatus(opts: StatusBarContents): void {
    hide = false
    parseContents(opts)

    if (opts.hide_after_secs) {
      setTimeout(() => {
        unsetContents()
      }, opts.hide_after_secs * 1000)
    }
  }
  ipc.on('start', async () => {
    console.log('Got start')
    hide = false
    text = undefined
    left_text = undefined
    right_text_1 = undefined
    right_text_2 = undefined
    fillcolor = 'fa0'
    progress = 0

    clearTimeout(endTimeout)
  })
  ipc.on('extract', (_event, { extract }) => {
    console.log(`Got Extract: ${extract}`)
  })
  ipc.on('progress', async (_event, { type, percent }) => {
    console.log(`Got Progress: ${type}, ${percent}`)
    hide = false
    text = `Загрузка ${$_(`statusbar.progresstypes.${type}`)}...`
    left_text = `${percent}%`
    progress = percent
    fillcolor = 'fa0'

    clearTimeout(endTimeout)
  })
  ipc.on('check', async (_event, { type, percent }) => {
    console.log(`Got check: ${type}, ${percent}`)
    hide = false
    text = `Проверка ${type}...`
    left_text = `${percent}%`
    progress = percent
    fillcolor = '80f'

    clearTimeout(endTimeout)
  })
  ipc.on('eta', (_event, { eta }) => {
    console.log(`Got ETA: ${eta}`)
    right_text_2 = `ещё ${eta}`
  })
  ipc.on('speed', (_event, { speed }) => {
    console.log(`Got speed: ${speed}`)
    right_text_1 = speed
  })
  ipc.on('start', async () => {
    console.log('Got start')
    hide = false
    text = `Minecraft запускается...`
    left_text = undefined
    right_text_1 = undefined
    right_text_2 = undefined
    progress = 100
    fillcolor = '5d5'
    endTimeout = setTimeout(() => {
      hide = true
      endTimeout = setTimeout(() => {
        progress = undefined
        fillcolor = 'fa0'
      }, 500)
    }, 2500)
  })
  ipc.on('close', () => {
    hide = false
    text = `Minecraft закрыт!`
    left_text = undefined
    right_text_1 = undefined
    right_text_2 = undefined
    progress = 100
    fillcolor = 'd44'
    endTimeout = setTimeout(() => {
      hide = true
      endTimeout = setTimeout(() => {
        progress = undefined
        fillcolor = 'fa0'
      }, 500)
    }, 2500)
  })
</script>

<div class="progressbarwrapper">
  {#if !hide}
  <div class="progressbar" in:fly={{x: 0, y: 100, duration: 400, easing: backOut, opacity: 0}} out:fly={{x: 0, y: 100, duration: 400, easing: backIn, opacity: 0}}>
    <clipPath class="fill" id="fill" style="width: {progress == null ? 0 : progress}%; background-color: #{fillcolor};"></clipPath>
    <div class="labels top" style="clip-path: polygon(0% 0%, 0% 100%, {progress == null ? 0 : progress}% 100%, {progress == null ? 0 : progress}% 0%);">
      <p class="primary">{!text ? displayText + '...' : text}</p>
      <p class="secondary left" style="filter: drop-shadow(0 0 2px #{fillcolor}) drop-shadow(0 0 2px #{fillcolor});">{left_text}</p>
      <p class="secondary right" style="filter: drop-shadow(0 0 2px #{fillcolor}) drop-shadow(0 0 2px #{fillcolor});">{right_text_1} {!right_text_1 ? '' : '•'} {right_text_2}</p>
    </div>
    <div class="labels bottom">
      <p class="primary">{!text ? displayText + '...' : text}</p>
      <p class="secondary left">{left_text}</p>
      <p class="secondary right">{right_text_1} {!right_text_1 ? '' : '•'} {right_text_2}</p>
    </div>
  </div>
  {/if}
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
    bottom: calc(0.5rem + 1px);
    right: 0.5rem;
    left: 0.5rem;

    background-color: #000;
    border-radius: 0.2rem;
    overflow: hidden;
    box-shadow: 0 2px 8px #000;

    display: flex;
    justify-content: center;
    align-items: center;

    &:after {
      content: '';
      bottom: 0;
      transform: translateX(100%) skewX(-25deg);
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
      animation: glint 2s infinite 3s;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 60%);
    }
    @keyframes glint {
      0% {
        transform: translateX(-100%) skewX(-25deg);
      }
      75%,
      100% {
        transform: translateX(100%) skewX(-25deg);
      }
    }

    .labels {
      position: absolute;
      width: 100%;
      text-align: center;
      white-space: nowrap;
      transition: clip-path 50ms ease-in-out;

      display: flex;
      align-items: center;

      &.bottom {
        color: var(--color-text-primary);
        z-index: 0;
        .secondary {
          filter: drop-shadow(0 0 2px #000) drop-shadow(0 0 2px #000);
        }
      }
      &.top {
        color: #000;
        z-index: 2;
        .secondary {
          font-weight: 900;
          paint-order: stroke fill;
        }
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
        width 50ms ease-in-out,
        background-color 50ms;
    }
  }
  @media (min-width: 600px) {
    .progressbarwrapper {
      width: 600px;
    }
  }
</style>
