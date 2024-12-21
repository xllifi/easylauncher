<script lang="ts">
  import { fade, scale } from 'svelte/transition'
  import { route } from '../stores/route.svelte'
  import { X } from 'lucide-svelte'
  import { backOut } from 'svelte/easing'
  import settings from './pages.json'
  import SettingsPageGeneral from './pages/SettingsPageGeneral.svelte'
  import SettingsPageLaunch from './pages/SettingsPageLaunch.svelte'
  import SettingsPage404 from './pages/SettingsPage404.svelte'
  import { tilt } from '../scripts/testtransition.svelte'

  function exitButtonClick(e: Event) {
    e.stopPropagation()
    if ($route.page == 'settings') $route.page = null
  }

  function exitByPressingEsc(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if ($route.page == 'settings') $route.page = null
    }
  }

  function changePage(e) {
    currentPageComponentName = e.target.id
    pageTitle = settings.pages.filter((x) => x.component === currentPageComponentName)[0].title
    switch (e.target.id) {
      case 'SettingsPageGeneral':
        return (Page = SettingsPageGeneral)
      case 'SettingsPageLaunch':
        return (Page = SettingsPageLaunch)
      default:
        pageTitle = 'Нет страницы'
        return (Page = SettingsPage404)
    }
  }

  let Page = $state(SettingsPageGeneral)
  let currentPageComponentName = $state('SettingsPageGeneral')
  let pageTitle = $state(settings.pages.filter((x) => x.component === currentPageComponentName)[0].title)
</script>

<svelte:window onkeyup={exitByPressingEsc} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="settings" onclick={exitButtonClick} tabindex="-1" out:fade={{duration:200}}>
  <div class="window" transition:scale={{ duration: 180, start: 1.5, easing: backOut }} onclick={(e) => e.stopPropagation()}>
    <div class="title">
      {#key pageTitle}
        <h2 class="text">Настройки <span class="arrow">/</span> <span in:tilt={{ duration: 200 }}>{pageTitle}</span></h2>
      {/key}
      <button class="close" onclick={exitButtonClick}>
        <X />
      </button>
    </div>
    <div class="left">
      {#each settings.pages as page}
        <button tabindex="0" class="tab" id={page.component} onclick={changePage} class:selected={currentPageComponentName === page.component}>{page.title}</button>
      {/each}
    </div>
    <div class="right">
      <Page />
    </div>
  </div>
</div>

<style lang="scss">
  div.settings {
    position: absolute;
    width: 100%;
    height: calc(100dvh - 1.5rem);
    backdrop-filter: blur(5px);
    padding: 5dvh 3.5dvw;

    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    div.window {
      min-height: 10rem;
      height: 20dvh;
      max-height: 30rem;
      min-width: 12rem;
      width: 80dvw;
      max-width: 50rem;
      flex: 1 1 0;

      display: grid;
      grid-template:
        'title title' 3rem
        'tabs content'
        'tabs content' 1fr / min(24dvw, 12rem) calc(100% - min(24dvw, 12rem));

      border-radius: 0.5rem;
      border: solid var(--color-border) 1px;
      background-color: var(--color-background-lighter);
      backdrop-filter: blur(5px);
      opacity: 98%;
      height: 100%;

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

        &::-webkit-scrollbar {
          width: 0.25rem;
          background-color: transparent;
          border-radius: 999px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #0006;
          border-radius: 999px;
        }
      }
    }
  }
</style>
