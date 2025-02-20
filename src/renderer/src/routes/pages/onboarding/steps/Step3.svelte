<script lang="ts">
  import { PackageCheck, PackagePlus, PackageX } from 'lucide-svelte'
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { params } from '../../../../lib/stores/params.svelte.js'
  import { _ } from 'svelte-i18n'

  interface Props {
    next: Function
  }
  let { next = $bindable() }: Props = $props()

  let wrapper: HTMLElement
  let scrolled: boolean = $state(false)

  function isWrapperScrolled() {
    scrolled = wrapper.scrollTop > 10
  }

  function chooseModpack(variant: ('min' | 'ess' | 'ful')) {
    $params.modpackType = variant
    next()
  }

  onMount(isWrapperScrolled)
</script>

<h1>{$_('modal.modpack.title')}</h1>
<div class="wrapper" class:scrolled bind:this={wrapper} onscroll={isWrapperScrolled}>
  {#if scrolled}
    <span class="scrolled" transition:fade={{ duration: 160 }}></span>
  {/if}
  <p class="description">{$_('modal.modpack.description')}<br />{$_('modal.modpack.onboardingextra')}</p>
  <button class="ful" onclick={() => {chooseModpack('ful')}}>
    <div class="cover">
      <PackagePlus />
      <h2>{$_('modal.modpack.options.ful.title')}</h2>
    </div>
    <p class="description">{$_('modal.modpack.options.ful.description')}</p>
  </button>
  <button class="ess" onclick={() => {chooseModpack('ess')}}>
    <div class="cover">
      <PackageX />
      <h2>{$_('modal.modpack.options.ess.title')}</h2>
    </div>
    <p class="description">{$_('modal.modpack.options.ess.description')}</p>
  </button>
  <button class="min" onclick={() => {chooseModpack('min')}}>
    <div class="cover">
      <PackageCheck />
      <h2>{$_('modal.modpack.options.min.title')}</h2>
    </div>
    <p class="description">{$_('modal.modpack.options.min.description')}</p>
  </button>
</div>

<style lang="scss">
  h1 {
    padding: 0.8rem 0;
    pointer-events: none;
  }
  div.wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto repeat(2, 1fr);
    padding: 0 calc(2rem - 14px) 2rem 2rem;
    gap: 0.4rem;
    flex-wrap: wrap;

    z-index: 2;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 14px;
    }
    &::-webkit-scrollbar-thumb {
      border: solid 4px #0000;
      background-clip: content-box;
      background-color: #fff1;
      border-radius: 9999px;
    }
    &::-webkit-scrollbar-button {
      height: 4px;
    }

    > p.description {
      width: 100%;
      grid-column: 1 / -1;
    }

    > .scrolled {
      width: 100%;
      height: 6rem;
      position: absolute;
      left: 0;
      top: 3.3rem;
      box-shadow: inset 0px 20px 4px -10px var(--color-background);
      z-index: 5;
      pointer-events: none;
    }

    > button {
      display: grid;
      grid: 1fr;
      padding: 0.6rem;
      z-index: 1;

      height: 8rem;

      :global(.lucide) {
        width: 100%;
        height: 3rem;
        stroke-width: 1.75;
      }

      div.cover {
        grid-row: 1;
        grid-column: 1;

        transition: opacity 200ms;
      }

      p.description {
        grid-row: 1;
        grid-column: 1;

        font-size: 0.9em;
        opacity: 0;
        transition: opacity 200ms;
      }

      &:hover {
        div.cover {
          opacity: 0;
        }
        p.description {
          opacity: 1;
        }
      }

      &.ful {
        grid-column: 1 / -1;
      }
    }
  }
</style>
