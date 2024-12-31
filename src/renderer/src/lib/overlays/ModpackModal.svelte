<script lang="ts">
  import { ArrowLeft, PackageCheck, PackagePlus, PackageX, X } from 'lucide-svelte'
  import { params } from '../stores/params.svelte.js'
  import { route } from '../stores/route.svelte.js'
  import type { MouseEventHandler } from 'svelte/elements'

  interface Props {
    exit: MouseEventHandler<any>
    back?: MouseEventHandler<any>
  }
  let { exit = $bindable(), back = $bindable() }: Props = $props()

  function chooseModpack(variant: 'min' | 'ess' | 'ful', e: MouseEvent & any) {
    $params.modpackType = variant
    exit(e)
  }
</script>

<div class="title">
  <button class="back" class:hidden={$route.overlay.previous == 'none' && back != null} onclick={back}><ArrowLeft /></button>
  <h2>Выбор типа сборки</h2>
  <button class="close" onclick={exit}><X /></button>
</div>
<div class="wrapper">
  <p class="description">Наведитесь на кнопку, чтобы узнать больше о сборке.</p>
  <button
    class="full"
    onclick={(e) => {
      chooseModpack('ful', e)
    }}
  >
    <div class="cover">
      <PackagePlus />
      <h2>Полная установка</h2>
    </div>
    <p class="description">Установить все моды, не исключить ничего. Рекомендуемый вариант для большинства игроков.<br />Для компьютеров средней-высокой мощности.</p>
  </button>
  <button
    class="essential"
    onclick={(e) => {
      chooseModpack('ess', e)
    }}
  >
    <div class="cover">
      <PackageX />
      <h2>Только необходимое</h2>
    </div>
    <p class="description">Не устанавливать ничего, кроме Minecraft и нескольких необходимых модов.<br />Не включает моды на оптимизацию.</p>
  </button>
  <button
    class="minimal"
    onclick={(e) => {
      chooseModpack('min', e)
    }}
  >
    <div class="cover">
      <PackageCheck />
      <h2>Минимальная установка</h2>
    </div>
    <p class="description">Установить только Minecraft и несколько модов на оптимизацию.<br />Для слабых компьютеров.</p>
  </button>
</div>

<style lang="scss">
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;

    padding: 0.2rem;

    border-bottom: solid 1px var(--color-border);

    h2 {
      font-family: Unbounded;
      transform: translateY(2px);
    }
    button:is(.close, .back) {
      top: 0.2rem;

      width: 2rem;
      height: 2rem;

      padding: 0.2rem;
      border-radius: 0.2rem;
      background-color: #0000;
      color: white;
      outline: solid 2px transparent;

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
      &.close {
        right: 0.2rem;
      }
      &.back {
        left: 0.2rem;
      }
      &.hidden {
        visibility: hidden;
      }
    }
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

    height: 100%;

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
      text-align: center;
      opacity: 0.7;
      font-size: 0.8rem;
      margin-top: 0.2rem;
      margin-bottom: -0.2rem;
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
