<script lang="ts">
  import { scale } from 'svelte/transition'
  import { route } from '../../stores/route.svelte'
  import { X } from 'lucide-svelte'
  import { backOut } from 'svelte/easing'
  import Switch from './components/Switch.svelte'
  import settings from './settings.json'

  function exitButtonClick() {
    if ($route.page == 'settings') $route.page = null
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="settings" on:click|self={exitButtonClick}>
  <div class="content" transition:scale={{ duration: 180, start: 1.1, easing: backOut }}>
    <div class="left">
      <h2 class="title">
        Настройки
      </h2>
      <ul class="tabs">
        {#each settings.pages as page}
          <li>{page.title}</li>
        {/each}
      </ul>
    </div>
    <div class="right"> 
      <!-- TODO: Use settings.json to determine page -->
      <button class="exit" on:click={exitButtonClick}>
        <X />
      </button>
      <h3>Page contents!</h3>
      <Switch name="setting 1"/>
      <Switch name="setting 2"/>
      <Switch name="setting 3" checked/>
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
      background-color: #222;
      backdrop-filter: blur(5px);
      opacity: 98%;
      height: 100%;

      div.left {
        // background-color: #282;
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

        ul.tabs {
          flex-grow: 1;
          padding: 0;
          list-style: none;

          li {
            margin: 0.3rem 0.4rem;
            background-color: #fff1;
            padding: 0.2rem 0.5rem;
            border-radius: 0.4rem;
            cursor: pointer;

            display: flex;

            transition: background-color 80ms;

            &:hover {
              background-color: #fff2;
            }

            &:first-of-type {
              margin-top: 0.4rem;
            }
            &:last-of-type {
              margin-bottom: 0.4rem;
            }

            &.selected {
              outline: solid 1px var(--color-border);
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

        padding: 0.2rem 0.6rem;

        button.exit {
          position: absolute;
          right: 0.4rem;
          top: 0.4rem;

          aspect-ratio: 1/1;
          padding: 0.2rem;
          line-height: 0;
          border: none;
          background-color: #0000;
          color: white;
          border-radius: 0.2rem;
          cursor: pointer;

          :global(.lucide) {
            transform: translateX(0.5px);
          }

          &:hover {
            background-color: #0004;
          }
        }
      }
    }
  }
</style>
