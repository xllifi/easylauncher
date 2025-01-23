<script lang="ts">
  import { X } from 'lucide-svelte'
  import SettingsPageGeneral from './pages/SettingsPageGeneral.svelte'
  import SettingsPageLaunch from './pages/SettingsPageLaunch.svelte'
  import SettingsPage404 from './pages/SettingsPage404.svelte'
  import { tilt } from '../../scripts/tilt_transition.js'
  import type { MouseEventHandler } from 'svelte/elements'
  import { fade } from 'svelte/transition'
  import { _ } from 'svelte-i18n'

  interface Props {
    exit: MouseEventHandler<any>
  }
  let { exit = $bindable() }: Props = $props()

  const pages = $state([
    {
      component: 'SettingsPageGeneral',
      title: 'modal.settings.pages.general.tab'
    },
    {
      component: 'SettingsPageLaunch',
      title: 'modal.settings.pages.launch.tab'
    }
  ])

  function changePage(e) {
    currentPageComponentName = e.target.id
    pageTitle = pages.filter((x) => x.component === currentPageComponentName)[0].title
    switch (e.target.id) {
      case 'SettingsPageGeneral':
        return (Page = SettingsPageGeneral)
      case 'SettingsPageLaunch':
        return (Page = SettingsPageLaunch)
      default:
        pageTitle = 'modal.settings.pages.404.tab'
        return (Page = SettingsPage404)
    }
  }

  let Page = $state(SettingsPageGeneral)
  let currentPageComponentName = $state('SettingsPageGeneral')
  let pageTitle = $state(pages.filter((x) => x.component === currentPageComponentName)[0].title)
</script>

<div class="layout">
  <div class="title">
    {#key pageTitle}
      <h2 class="text">{$_('modal.settings.title')} <span class="arrow">/</span> <span in:tilt={{ duration: 200 }}>{$_(pageTitle)}</span></h2>
    {/key}
    <button class="close" onclick={exit}>
      <X />
    </button>
  </div>
  <div class="left">
    {#each pages as page}
      <button tabindex="0" class="tab" id={page.component} onclick={changePage} class:selected={currentPageComponentName === page.component}>{$_(page.title)}</button>
    {/each}
  </div>
  {#key Page}
    <div class="right" transition:fade={{ duration: 100 }}>
      <Page />
    </div>
  {/key}
</div>

<style lang="scss">
  :global(.svooltip) {
    max-width: min(60dvw, 32rem);
  }
  div.layout {
    width: 100%;
    height: 100%;
    flex: 1 1 0;

    display: grid;
    grid-template:
      'title title' 3rem
      'tabs content'
      'tabs content' 1fr / min(24dvw, 12rem) calc(100% - min(24dvw, 12rem));

    div.title {
      grid-area: title;

      position: relative;

      display: flex;
      align-items: center;

      border-bottom: solid 1px var(--color-border);

      h2.text {
        margin-left: 0.8rem;

        display: flex;
        align-items: center;

        font-family: Unbounded;
        font-size: 1.4rem;
        transform: translateY(1px);
        border: none;
        color: #fff;

        span.arrow {
          opacity: 0.5;
          margin: 0 0.5rem;
        }
      }
      button.close {
        position: absolute;
        right: 0.2rem;

        width: 2rem;
        height: 2rem;

        padding: 0.2rem;
        border-radius: 0.2rem;
        background-color: #0000;
        color: white;
        outline: solid 2px transparent;
        border: none;

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        transition:
          background-color 80ms,
          outline-color 100ms,
          filter 100ms;

        &:is(:hover, :focus-visible) {
          background-color: #0004;
          outline: solid 2px var(--theme-accent-active);
          filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
        }
      }
    }

    div.left {
      grid-area: tabs;
      display: flex;
      flex-direction: column;

      border-right: solid 1px var(--color-border);

      padding: 0.6rem;
      padding-top: 0.7rem;
      padding-right: calc(0.6rem - 0.25rem);
      gap: 0.4rem;

      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 0.25rem;
        background-color: transparent;
        border-radius: 999px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #0006;
        border-radius: 999px;
      }

      button.tab {
        color: var(--color-text);
        font-family: Inter;
        font-size: 0.95rem;
        line-height: 1.6;
        background-color: #0006;
        border: none;
        outline: solid 2px var(--theme-accent-inactive);
        padding: 0.1rem 0.4rem;
        margin: 0;
        border-radius: 0.3rem;
        cursor: pointer;

        display: flex;

        transition:
          background-color 80ms,
          outline-color 100ms,
          filter 100ms;

        &:is(:hover, :focus-visible) {
          background-color: #0008;
          filter: none;
        }
        &:focus-visible {
          &.selected {
            background-color: #000c;
          }
          &:not(.selected) {
            outline: solid 2px var(--theme-accent-active);
          }
        }

        &.selected {
          outline: solid 2px var(--theme-accent-active);
          filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
        }

        :global(.lucide) {
          width: 1rem;
          stroke-width: 2.3;
          shape-rendering: geometricPrecision;
          margin-right: 0.2rem;
        }
      }
    }

    div.right {
      grid-area: content;
      position: relative;

      padding: 0.6rem;

      flex: 1 1 0;
      overflow-y: scroll;
      // margin-right: -0.2rem;
      padding-right: 0.2rem;
      // background-color: var(--color-background);

      &::-webkit-scrollbar {
        width: 0.25rem;
        height: 0.25rem;
        background-color: transparent;
        border-radius: 999px;
      }
      &::-webkit-scrollbar-corner {
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #0006;
        border-radius: 999px;
      }
    }
  }
</style>
