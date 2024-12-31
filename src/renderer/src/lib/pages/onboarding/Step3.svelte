<script lang="ts">
  import { PackageCheck, PackagePlus, PackageX } from 'lucide-svelte'
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { params } from '../../stores/params.svelte.js'

  interface Props {
    next: Function
  }
  let { next = $bindable() }: Props = $props()

  let wrapper: HTMLElement
  let scrolled: boolean = $state(false)

  function isWrapperScrolled() {
    console.log(wrapper.scrollTop)
    scrolled = wrapper.scrollTop > 10
  }

  function chooseModpack(variant: ('min' | 'ess' | 'ful')) {
    $params.modpackType = variant
    next()
  }

  onMount(isWrapperScrolled)
</script>

<h1>Выберите тип сборки</h1>
<div class="wrapper" class:scrolled bind:this={wrapper} onscroll={isWrapperScrolled}>
  {#if scrolled}
    <span class="scrolled" transition:fade={{ duration: 160 }}></span>
  {/if}
  <p class="description">Наведитесь на кнопку, чтобы узнать больше о сборке.<br />Изменить этот выбор можно в любое время в настройках лаунчера.</p>
  <button class="full" onclick={() => {chooseModpack('ful')}}>
    <div class="cover">
      <PackagePlus />
      <h2>Полная установка</h2>
    </div>
    <p class="description">Установить все моды, не исключить ничего. Рекомендуемый вариант для большинства игроков.<br />Для компьютеров средней-высокой мощности.</p>
  </button>
  <button class="essential" onclick={() => {chooseModpack('ess')}}>
    <div class="cover">
      <PackageX />
      <h2>Только необходимое</h2>
    </div>
    <p class="description">Не устанавливать ничего, кроме Minecraft и нескольких необходимых модов.<br />Не включает моды на оптимизацию.</p>
  </button>
  <button class="minimal" onclick={() => {chooseModpack('min')}}>
    <div class="cover">
      <PackageCheck />
      <h2>Минимальная установка</h2>
    </div>
    <p class="description">Установить только Minecraft и несколько модов на оптимизацию.<br />Для слабых компьютеров.</p>
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

      &.full {
        grid-column: 1 / -1;
      }
    }
  }
</style>
