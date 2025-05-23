<script lang="ts">
  import { fly } from 'svelte/transition'
  import type { StatusBarContents } from '../lib/types/components.d.ts'
  import { backIn, backOut } from 'svelte/easing'
  import { ipc } from '../main.js'
  import { _ } from 'svelte-i18n'
  import { onMount } from 'svelte'
  import { appstate } from '../lib/stores/appstate.svelte.js'

  let text: string | null = $state(null)
  let left_text: string | null = $state(null)
  let progress: number = $state(0)
  let hideTimeout: NodeJS.Timeout | null = $state(null)
  let isHidden: boolean = $state(true)
  let fillcolor: string = $state('fa0')

  const texts: string = $_('statusbar.texts')
  let displayText = $state(texts[Math.floor(Math.random() * texts.length)])
  setInterval(() => {
    displayText = texts[Math.floor(Math.random() * texts.length)]
  }, 2500)

  function parseContents(opts: StatusBarContents): void {
    text = opts.text ? opts.text : null
    left_text = opts.left_text ? opts.left_text : null
    fillcolor = opts.fillcolor ? opts.fillcolor : 'fa0'
    progress = opts.progress ? opts.progress : 0
  }
  function unsetContents(): void {
    hide()
    setTimeout(() => {
      text = null
      left_text = null
      fillcolor = 'fa0'
      progress = 0
    }, 500)
  }

  export function setStatus(opts: StatusBarContents): void {
    show()
    parseContents(opts)

    if (opts.hide_after_secs) {
      setTimeout(() => {
        unsetContents()
      }, opts.hide_after_secs * 1000)
    }
  }

  ipc.on('progress', async (_event, { type, percent }) => {
    console.log(`Got Progress: ${type}, ${percent}`)
    show()
    text = `${$_('statusbar.downloading')} ${$_(`statusbar.progresstypes.${type}`)}...`
    left_text = `${percent}%`
    progress = percent
    fillcolor = 'fa0'

    resetHideTimeout()
  })
  ipc.on('start', () => {
    show()
    text = $_('statusbar.minecraft_started')
    left_text = null
    progress = 100
    fillcolor = '5d5'

    hidetimeout()
  })
  ipc.on('close', (_e, exitcode) => {
    show()
    text = $_('statusbar.minecraft_closed')
    if (exitcode/* is not 0*/) {
      text += " " + $_('statusbar.minecraft_closed_exitcode', { values: { exitcode: exitcode || '0' } })
    }
    left_text = null
    progress = 100
    fillcolor = 'd55'

    hidetimeout()
  })
  ipc.on('launch-cancelled', () => hide())

  function resetHideTimeout() {
    if (hideTimeout) clearTimeout(hideTimeout)
  }
  function hidetimeout() {
    resetHideTimeout()
    hideTimeout = setTimeout(() => {
      hide()
      setTimeout(() => unsetContents(), 3000)
    }, 2500)
  }
  function hide() {
    isHidden = true
  }
  function show() {
    resetHideTimeout()
    isHidden = false
  }

  onMount(() => {
    appstate.subscribe(({ current }) => {
      if (current == 'launch') {
        show()
      }
    })
  })
</script>

<div class="progressbarwrapper">
  {#if !isHidden}
    <div class="progressbar" in:fly={{ x: 0, y: -100, duration: 400, easing: backOut, opacity: 0 }} out:fly={{ x: 0, y: -100, duration: 400, easing: backIn, opacity: 0 }}>
      <clipPath class="fill" id="fill" style="width: {progress == null ? 0 : progress}%; background-color: #{fillcolor};"></clipPath>
      <div class="labels top" style="clip-path: polygon(0% 0%, 0% 100%, {progress == null ? 0 : progress}% 100%, {progress == null ? 0 : progress}% 0%);">
        <p class="primary">{!text ? displayText + '...' : text}</p>
        <p class="secondary left" style="filter: drop-shadow(0 0 2px #{fillcolor}) drop-shadow(0 0 2px #{fillcolor});">{left_text}</p>
      </div>
      <div class="labels bottom">
        <p class="primary">{!text ? displayText + '...' : text}</p>
        <p class="secondary left">{left_text}</p>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .progressbarwrapper {
    width: 100%;
    height: calc(100% - 2rem);

    position: fixed;
    bottom: 0;

    overflow: hidden;
    pointer-events: none;
    display: flex;
    justify-content: center;
  }
  .progressbar {
    width: calc(100% - 1rem);
    height: 2rem;

    position: relative;
    top: 0.5rem;

    background-color: #000;
    border-radius: 0.2rem;
    overflow: hidden;
    box-shadow: 0 -2px 8px #000;

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
      animation: infinite 1.5s glint 3s;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 60%);
    }
    @keyframes glint {
      0% {
        transform: translateX(-100%) skewX(-25deg);
      }
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
    .progressbar {
      width: calc(600px - 1rem);
    }
  }
</style>
