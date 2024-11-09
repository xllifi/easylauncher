<script lang="ts">
  import { scale } from 'svelte/transition'
  import { route } from '../stores/route.svelte'
  import { X } from 'lucide-svelte'
  import { backOut } from 'svelte/easing'
  import settings from './settings.json'
  import SettingsPageGeneral from './pages/SettingsPageGeneral.svelte'
  import SettingsPageLaunch from './pages/SettingsPageLaunch.svelte'
  import SettingsPage404 from './pages/SettingsPage404.svelte'

  function exitButtonClick(e: Event) {
    e.stopPropagation()
    if ($route.page == 'settings') $route.page = null
  }

  function exitByPressingEsc(e: KeyboardEvent) {
    if (e.key === "Escape") {
      if ($route.page == 'settings') $route.page = null
    }
  }

  function changePage(e) {
    currentPageComponentName = e.target.id
    pageTitle = settings.pages.filter(x => x.component === currentPageComponentName)[0].title
    switch (e.target.id) {
      case 'SettingsPageGeneral':
        return Page = SettingsPageGeneral
      case 'SettingsPageLaunch':
        return Page = SettingsPageLaunch
      default:
        pageTitle = 'Неизвестная страница'
        return Page = SettingsPage404
    }
  }

  let Page = $state(SettingsPageGeneral)
  let currentPageComponentName = $state('SettingsPageGeneral')
  let pageTitle = $state(settings.pages.filter(x => x.component === currentPageComponentName)[0].title)
</script>

<svelte:window onkeyup={exitByPressingEsc}/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="settings" onclick={exitButtonClick} tabindex="-1">
  <div class="content" transition:scale={{ duration: 180, start: 1.5, easing: backOut }} onclick={(e) => e.stopPropagation()}>
    <div class="left">
      <h2 class="title">Настройки</h2>
      <div class="tabs">
        {#each settings.pages as page}
          <button tabindex="0" class="tab" id={page.component} onclick={changePage} class:selected={currentPageComponentName === page.component}>{page.title}</button>
        {/each}
      </div>
    </div>
    <div class="right">
      <div class="page-content">
        <button class="close" onclick={exitButtonClick}>
          <X />
        </button>
        <div class="title">
          <h3>{pageTitle}</h3>
        </div>
        <Page />
      </div>
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

    div.content {
      min-height: 10rem;
      height: 20dvh;
      max-height: 30rem;
      min-width: 12rem;
      width: 80dvw;
      max-width: 50rem;
      flex: 1 1 0;

      display: grid;
      grid-template-columns: 1fr 3fr;

      border-radius: 0.5rem;
      border: solid var(--color-border) 1px;
      background-color: var(--color-background-lighter);
      backdrop-filter: blur(5px);
      opacity: 98%;
      height: 100%;

      div.left {
        display: flex;
        flex-direction: column;

        border-right: solid 1px var(--color-border);

        h2.title {
          padding: 0.6rem 1rem;

          text-align: center;
          font-family: Unbounded;
          font-weight: 600;
          font-size: 1.4rem;
          transform: skewX(-10deg) translateY(4px);
          border: none;
          color: #fff;
          background-color: transparent;
        }

        div.tabs {
          flex-grow: 1;
          display: flex;
          flex-direction: column;

          button.tab {
            margin: 0.3rem 0.6rem;
            color: var(--color-text);
            font-family: Inter;
            font-size: 0.95rem;
            line-height: 1.6;
            background-color: #0006;
            border: none;
            outline: solid 2px var(--theme-accent-inactive);
            padding: 0.1rem 0.4rem;
            border-radius: 0.3rem;
            cursor: pointer;

            display: flex;

            transition: background-color 80ms, outline-color 100ms, filter 100ms;

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

            &:first-of-type {
              margin-top: 0.4rem;
            }
            &:last-of-type {
              margin-bottom: 0.4rem;
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
      }

      div.right {
        position: relative;

        padding: 0.6rem;

        div.page-content {
          height: 100%;

          button.close {
            position: absolute;
            right: 0.6rem;
            top: 0.6rem;
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
            
            transition: background-color 80ms, outline-color 100ms, filter 100ms;

            &:is(:hover, :focus-visible) {
              background-color: #0004;
              outline: solid 2px var(--theme-accent-active);
              filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
            }
          }
          h3 {
            height: 2rem;
            margin-bottom: 0.5rem;
            height: 100%;
            font-size: 1.4rem;
          }
        }
      }
    }
  }
</style>
