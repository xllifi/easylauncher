<script lang="ts">
  import { ArrowLeft, PackageCheck, PackagePlus, PackageX, X } from 'lucide-svelte'
  import { params } from '../stores/params.svelte.js'
  import { route } from '../stores/route.svelte.js'
  import { _ } from 'svelte-i18n'
  import type { ModalProps } from './types.js'

  let { exit = $bindable(), back = $bindable() }: ModalProps = $props()

  function chooseModpack(variant: 'min' | 'ess' | 'ful', e: MouseEvent & any) {
    $params.modpackType = variant
    exit(e)
  }
</script>

<div class="title">
  <button class="back" class:hidden={$route.modal.previous == null && back != null} onclick={back}><ArrowLeft /></button>
  <h2>{$_('modal.modpack.title')}</h2>
  <button class="close" onclick={exit}><X /></button>
</div>
<div class="wrapper">
  <p class="description">{$_('modal.modpack.description')}</p>
  <button
    class="modpack ful"
    data-selected={$_('modal.modpack.selected')}
    class:selected={$params.modpackType === 'ful'}
    onclick={(e) => {
      chooseModpack('ful', e)
    }}
  >
    <div class="cover">
      <PackagePlus />
      <h2>{$_('modal.modpack.options.ful.title')}</h2>
    </div>
    <p class="description">{$_('modal.modpack.options.ful.description')}</p>
  </button>
  <button
    class="modpack ess"
    data-selected={$_('modal.modpack.selected')}
    class:selected={$params.modpackType === 'ess'}
    onclick={(e) => {
      chooseModpack('ess', e)
    }}
  >
    <div class="cover">
      <PackageX />
      <h2>{$_('modal.modpack.options.ess.title')}</h2>
    </div>
    <p class="description">{$_('modal.modpack.options.ess.description')}</p>
  </button>
  <button
    class="modpack min"
    data-selected={$_('modal.modpack.selected')}
    class:selected={$params.modpackType === 'min'}
    onclick={(e) => {
      chooseModpack('min', e)
    }}
  >
    <div class="cover">
      <PackageCheck />
      <h2>{$_('modal.modpack.options.min.title')}</h2>
    </div>
    <p class="description">{$_('modal.modpack.options.min.description')}</p>
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
    grid-template-rows: 18px repeat(2, 8.4rem) auto;
    padding: 0 2rem 2rem 2rem;
    margin-left: 14px;
    gap: 0.4rem;
    flex-wrap: wrap;

    z-index: 2;
    overflow-y: scroll;

    height: 100%;

    &::-webkit-scrollbar {
      height: 14px;
      width: 14px;
    }
    &::-webkit-scrollbar-thumb {
      border: solid 4px #0000;
      background-clip: content-box;
      background-color: #fff1;
      border-radius: 9999px;
    }
    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }
    &::-webkit-scrollbar-button {
      width: 4px;
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

    button.modpack {
      position: relative;
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
        white-space: pre-line;
      }

      &:is(:hover, :focus-visible) {
        div.cover {
          opacity: 0;
        }
        p.description {
          opacity: 1;
        }
      }

      &.ful {
        grid-column: 1 / -1;

        color: mix(#5f5, #fff, 10%)
      }
      &.min {
        color: mix(#55f, #fff, 10%)
      }
      &.ess {
        color: mix(#f55, #fff, 5%)
      }

      &.selected::after {
        position: absolute;
        top: 0.2rem;
        right: -0.8rem;
        transform: rotateZ(10deg);
        content: attr(data-selected);
        background-color: #5f5;
        color: #000;
        font-family: Unbounded;
        font-size: 1.35rem;
        font-weight: 700;
        padding: 0.3rem;
        padding-bottom: 0.1rem;
        border-radius: 0.4rem;

        perspective: 5.5cm;

        transition: font-size 400ms ease-out, opacity 200ms;

      }
      @media (max-width: 720px) {
        &:not(.ful).selected::after {
          font-size: 0.9rem;
        }
      }
      &.selected:is(:hover, :focus-visible)::after {
        opacity: 0;
      }
    }
  }
</style>
