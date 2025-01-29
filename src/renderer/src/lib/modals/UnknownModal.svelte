<script lang="ts">
  import { ArrowLeft, X } from 'lucide-svelte'
  import type { MouseEventHandler } from 'svelte/elements'
  import { _ } from 'svelte-i18n'
  import { route } from '../stores/route.svelte.js'

  interface Props {
    exit: MouseEventHandler<any>
    back: MouseEventHandler<any>
  }
  let { exit = $bindable(), back = $bindable() }: Props = $props()
</script>

<div class="title">
  <button class="back" class:hidden={$route.modal.previous == 'none' && back != null} onclick={back}><ArrowLeft /></button>
  <h2>{$_('modal.unknown.title')}</h2>
  <button class="close" onclick={exit}><X /></button>
</div>
<div class="wrapper">
  <p class="description">{$_('modal.unknown.description')}</p>
  <button class="close" onclick={exit}>Закрыть окно</button>
</div>

<style lang="scss">
  div.title {
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
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 8px;
    padding-right: 0;
    gap: 8px;

    overflow-y: scroll;

    &::-webkit-scrollbar {
      height: 8px;
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border: solid 2px #0000;
      background-clip: content-box;
      background-color: #fff1;
      border-radius: 9999px;
    }
    &::-webkit-scrollbar-button {
      width: 4px;
      height: 4px;
    }

    > p.description {
      opacity: 0.4;
      font-size: 0.8rem;
      padding: 0 0.8rem;

      text-align: center;
      white-space: pre-line;
      line-height: 1.2;
    }

    > button.close {
      position: absolute;
      bottom: 0.6rem;
    }
  }
</style>
