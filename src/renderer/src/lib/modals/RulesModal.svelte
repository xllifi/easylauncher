<script lang="ts">
  import { ArrowLeft, X } from 'lucide-svelte'
  import type { MouseEventHandler } from 'svelte/elements'
  import { _ } from 'svelte-i18n'
  import { route } from '../stores/route.svelte.js'
  import { params } from '../stores/params.svelte.js'

  interface Props {
    exit: MouseEventHandler<any>
    back: MouseEventHandler<any>
  }
  let { exit = $bindable(), back = $bindable() }: Props = $props()
  const rules = [
    {
      title: 'modal.rules.entries.respect.title',
      content: 'modal.rules.entries.respect.content'
    },
    {
      title: 'modal.rules.entries.integrity.title',
      content: 'modal.rules.entries.integrity.content'
    },
    {
      title: 'modal.rules.entries.vigilant.title',
      content: 'modal.rules.entries.vigilant.content'
    }
  ]
  const ruleEls: HTMLInputElement[] = $state([])
  const confirmedRules: number[] = $state([])
  let confirmedAll: boolean = $state(false)

  function ruleConfirmed(e: MouseEvent) {
    const target: HTMLInputElement = e.target as HTMLInputElement
    if (!target) return

    const ruleIndex = ruleEls.indexOf(target)
    if (target.checked) confirmedRules.push(ruleIndex)
      else confirmedRules.splice(confirmedRules.indexOf(ruleIndex), 1)

    confirmedAll = ruleEls.length === confirmedRules.length
  }

  function confirm() {
    $params.rulesConfirmed = true
    $route.modal.current = 'none'
  }
</script>

<div class="title">
  <button class="back" class:hidden={$route.modal.previous == 'none' && back != null} onclick={back}><ArrowLeft /></button>
  <h2>{$_('modal.rules.title')}</h2>
  <button class="close" onclick={exit}><X /></button>
</div>
<div class="wrapper">
  <p class="description">{$_('modal.rules.description')}</p>
  {#each rules as rule}
    <label class="rule">
      <input type="checkbox" class="button" bind:this={ruleEls[rules.indexOf(rule)]} onclick={ruleConfirmed} />
      <h3 class="title">{$_(rule.title)}</h3>
      <p class="content">{$_(rule.content)}</p>
    </label>
  {/each}
  <button class="continue" disabled={!confirmedAll} onclick={confirm}>{$_('modal.rules.continue')}</button>
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
      margin: -0.3rem 0;
    }

    > label.rule {
      background-color: var(--color-background);
      padding: 0.5rem;
      border-radius: 0.3rem;
      width: 100%;

      cursor: pointer;

      display: grid;
      grid-template-columns: auto 3rem;
      grid-template-rows: auto auto;

      > input.button {
        grid-row: 1 / span 2;
        grid-column: 2;

        pointer-events: none;

        display: flex;
        justify-content: center;

        margin: -0.4rem;

        &::before {
          width: 1.5rem;
          align-self: center;
        }
      }

      > h3.title {
        grid-column: 1;
        grid-row: 1;
        width: 100%;

        font-family: Unbounded;
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      > p.content {
        grid-column: 1;
        grid-row: 2;
      }
    }
  }
</style>
