<script lang="ts">
  import Dragbar from './lib/components/Dragbar.svelte'
  import Main from './lib/pages/Main.svelte'
  import Settings from './lib/overlays/settings/SettingsModal.svelte'
  import { route } from './lib/stores/route.svelte'
  import { fly, scale } from 'svelte/transition'
  import { backIn, backOut } from 'svelte/easing'
  import LoginModal from './lib/overlays/login/LoginModal.svelte'
  import { getLocaleFromNavigator, init, isLoading, register } from 'svelte-i18n'
  import { params } from './lib/stores/params.js'

  window.addEventListener('DOMContentLoaded', () => {
    $route.loaded = true
  })

  function exitButtonClick(e: Event) {
    e.stopPropagation()
    $route.overlay.previous = 'none'
    $route.overlay.current = 'none'
  }

  function backButtonClick() {
    $route.overlay.current = $route.overlay.previous
    $route.overlay.previous = 'none'
  }

  function exitByPressingEsc(e: KeyboardEvent): void {
    if (e.key === 'Escape' && $route.overlay.current != 'none') {
      const activeEl = document.activeElement as HTMLElement | null
      if (activeEl && activeEl.tagName == 'INPUT') return activeEl.blur()

      $route.overlay.previous = 'none'
      $route.overlay.current = 'none'
    }
  }

  register("ru", () => import("./lib/i18n/ru.json"));
  register("en", () => import("./lib/i18n/en.json"));

  if (!$params.lang) $params.lang = getLocaleFromNavigator()!

  init({
    fallbackLocale: "en",
    initialLocale: $params.lang
  });
</script>

<svelte:window onkeyup={exitByPressingEsc} />

{#if $isLoading || !$route.loaded}
  ...
{:else}
  <Dragbar />
  <div class="body">
    <!-- Page -->
    {#if $route.page == 'main'}
      <Main />
    {/if}
    <!-- Overlay -->
    {#if $route.overlay.current != 'none'}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="overlay" onclick={exitButtonClick} tabindex="-1" out:scale={{ duration: 200, start: 0, easing: backIn }} in:scale={{ duration: 200, start: 1.5, easing: backOut }}>
        {#key $route.overlay.current}
          <div class="inner" onclick={(e) => e.stopPropagation()} out:fly={{ duration: 200, y: 100 }} in:fly={{ delay: 60, duration: 200, y: -100 }}>
            {#if $route.overlay.current == 'settings'}
              <Settings exit={exitButtonClick} />
            {:else if $route.overlay.current == 'login'}
              <LoginModal exit={exitButtonClick} back={backButtonClick} />
            {/if}
          </div>
        {/key}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .body {
    width: 100%;
    height: 100%;
    position: relative;

    .overlay {
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

      .inner {
        position: absolute;

        min-height: 10rem;
        height: calc(90dvh - 1.5rem);
        max-height: 30rem;
        min-width: 12rem;
        width: 90dvw;
        max-width: 50rem;

        border-radius: 0.5rem;
        border: solid var(--color-border) 1px;
        background-color: var(--color-background-lighter);
        backdrop-filter: blur(5px);
        opacity: 98%;
      }
    }
  }
</style>
