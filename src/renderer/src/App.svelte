<script lang="ts">
  import Dragbar from './lib/components/Dragbar.svelte'
  import Main from './lib/pages/main/Main.svelte'
  import Settings from './lib/modals/settings/SettingsModal.svelte'
  import { route } from './lib/stores/route.svelte'
  import { fade, fly, scale } from 'svelte/transition'
  import { backIn, backOut } from 'svelte/easing'
  import LoginModal from './lib/modals/LoginModal.svelte'
  import { getLocaleFromNavigator, init, isLoading, register } from 'svelte-i18n'
  import { params } from './lib/stores/params.svelte.js'
  import Step1 from './lib/pages/onboarding/Index.svelte'
  import ModpackModal from './lib/modals/ModpackModal.svelte'
  import StatusBar from './lib/components/StatusBar.svelte'
  import StatusFeed from './lib/components/StatusFeed.svelte'
  import RulesModal from './lib/modals/RulesModal.svelte'
  import FeedbackModal from './lib/modals/FeedbackModal.svelte'
  import UnknownModal from './lib/modals/UnknownModal.svelte'
  import { ipc } from './lib/scripts/general.js'
  import { appstate } from './lib/stores/appstate.svelte.js'

  window.addEventListener('DOMContentLoaded', () => {
    $route.loaded = true
  })

  // this is insanity
  // svelte-ignore non_reactive_update
  let statusFeed: StatusFeed

  let readyForExit: boolean = $state(false)

  function exitButtonClick() {
    $route.modal.previous = 'none'
    $route.modal.current = 'none'
  }

  function exitModalStart(e: Event) {
    e.stopPropagation()
    readyForExit = true
  }
  function exitModalCancel(e: Event) {
    e.stopPropagation()
    readyForExit = false
  }
  function exitModalEnd() {
    if (readyForExit) exitButtonClick()
  }

  function backButtonClick() {
    $route.modal.current = $route.modal.previous
    $route.modal.previous = 'none'
  }

  function exitByPressingEsc(e: KeyboardEvent): void {
    if (e.key === 'Escape' && $route.modal.current != 'none') {
      const activeEl = document.activeElement as HTMLElement | null
      if (activeEl && activeEl.tagName == 'INPUT') return activeEl.blur()

      $route.modal.previous = 'none'
      $route.modal.current = 'none'
    }
  }

  register('ru', () => import('./lib/i18n/ru.json'))
  register('en', () => import('./lib/i18n/en.json'))

  if (!$params.lang) $params.lang = getLocaleFromNavigator()!

  ipc.on('start', () => {
    if ($appstate.current === 'launch') {
      $appstate.current = 'idle'
    }
  })
  ipc.on('launch-cancelled', () => {
    if ($appstate.current === 'launch') {
      $appstate.current = 'idle'
    }
  })

  ipc.on('addmcpid', (_event, { pid }) => {
    $appstate.minecraftPids = [...$appstate.minecraftPids, pid]
  })
  ipc.on('rmmcpid', (_event, { pid }) => {
    $appstate.minecraftPids = $appstate.minecraftPids.filter(x => x != pid)
  })

  ipc.on('loginresponse', (_event, { launchCredentials }) => $params.launchCredentials = launchCredentials)

  init({
    fallbackLocale: 'en',
    initialLocale: $params.lang
  })
</script>

<svelte:window onkeyup={exitByPressingEsc} />

<Dragbar />
{#if $isLoading || !$route.loaded}
  <div class="wrapper" out:fade>
    <span class="loading"></span>
  </div>
{:else}
  <div class="body" transition:fade={{ duration: 200 }}>
    <!-- Page -->
    {#key $route.page}
      <div class="inner" transition:fade>
        {#if $route.page == 'main'}
          <Main />
        {:else if $route.page == 'onboarding'}
          <Step1 />
        {/if}
      </div>
    {/key}
    <!-- Modal -->
    {#if $route.modal.current != 'none'}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="modal" onmousedown={exitModalStart} onmouseleave={exitModalCancel} onmouseup={exitModalEnd} tabindex="-1" out:scale={{ duration: 200, start: 0, easing: backIn }} in:scale={{ duration: 200, start: 1.5, easing: backOut }}>
        {#key $route.modal.current}
          <div class="inner" onmouseenter={exitModalCancel} onmousedown={(e) => e.stopPropagation()} onmouseleave={(e) => e.stopPropagation()} onmouseup={(e) => e.stopPropagation()} out:fly={{ duration: 200, y: 100 }} in:fly={{ delay: 60, duration: 200, y: -100 }}>
            {#if $route.modal.current == 'settings'}
              <Settings exit={exitButtonClick} />
            {:else if $route.modal.current == 'login'}
              <LoginModal exit={exitButtonClick} back={backButtonClick} />
            {:else if $route.modal.current == 'modpack'}
              <ModpackModal exit={exitButtonClick} back={backButtonClick} />
            {:else if $route.modal.current == 'rules'}
              <RulesModal exit={exitButtonClick} back={backButtonClick} />
            {:else if $route.modal.current == 'feedback'}
              <FeedbackModal exit={backButtonClick} back={backButtonClick} statusFeed={statusFeed} />
            {:else}
              <UnknownModal exit={exitButtonClick} back={backButtonClick} />
            {/if}
          </div>
        {/key}
      </div>
    {/if}
    <!-- Unconditional elements -->
    <StatusBar />
    <StatusFeed bind:this={statusFeed}/>
  </div>
{/if}

<style lang="scss">
  div.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    -webkit-app-region: drag;

    width: 100%;
    height: calc(100% - 2rem);

    > span.loading {
      position: fixed;
      width: 3rem;
      height: 3rem;

      border-radius: 9999px;

      background-color: var(--theme-accent-inactive);
      outline: solid 4px var(--theme-accent-inactive);
      outline-offset: 5px;

      animation: pulse 1s ease-in-out infinite;
    }

    @keyframes pulse {
      0% {
        scale: 1;
        outline-offset: 5px;
      }
      40% {
        scale: 1.1;
        outline-offset: 6px;
      }
      80% {
        scale: 1;
        outline-offset: 5px;
      }
      100% {
        scale: 1;
      }
    }
  }
  .body {
    width: 100%;
    height: calc(100% - 1.5rem);
    position: relative;

    > .inner {
      width: 100%;
      height: 100%;
      position: fixed;
    }

    > .modal {
      position: absolute;
      width: calc(100% + 12rem);
      height: calc(100dvh - 2rem + 12rem);
      top: -6rem;
      left: -6rem;

      padding: 5dvh 3.5dvw;
      backdrop-filter: blur(5px);
      z-index: 1;

      display: flex;
      justify-content: center;
      align-items: center;

      > .inner {
        position: fixed;

        display: flex;
        flex-direction: column;

        min-height: 10rem;
        height: calc(90dvh - 1.5rem);
        max-height: 30rem;
        min-width: 12rem;
        width: 90dvw;
        max-width: 50rem;

        border-radius: 0.5rem;
        border: solid var(--color-border) 1px;
        background-color: var(--color-background-lighter);
        overflow: hidden;
      }
    }
  }
</style>
