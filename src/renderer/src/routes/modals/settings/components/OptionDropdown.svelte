<script lang="ts">
  import { ChevronDown } from 'lucide-svelte'
  import { cubicOut } from 'svelte/easing'
  import type { MouseEventHandler } from 'svelte/elements'
  import { fly } from 'svelte/transition'
  import { tooltip } from '../../../../lib/actions/tooltip.svelte.js'

  interface Props {
    onclick: MouseEventHandler<HTMLButtonElement>
    name: string
    description: string
    actionLabel: string
    options: {
        name: string
        action: MouseEventHandler<HTMLButtonElement>
      }[]
  }
  let { onclick, name, description, actionLabel, options }: Props = $props()

  let lblHov: boolean = $state(false)

  function mIn() {
    lblHov = true
  }
  function mOut() {
    lblHov = false
  }
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<label class="dropdown" use:tooltip={[description]} onmouseover={mIn} onmouseleave={mOut}>
  <p>{name}</p>
  <button {onclick} aria-label={name} class:rotateChev={lblHov} onfocus={mIn}>{actionLabel} <ChevronDown /></button>
  {#if lblHov}
    <div class="options" transition:fly={{ duration: 100, y: -20, easing: cubicOut }}>
      {#each options as opt}
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <button onfocusout={options.indexOf(opt) == options.length-1 ? mOut : null} id="dropdown_button" onclick={opt.action}>{opt.name}</button>
      {/each}
    </div>
  {/if}
</label>

<style lang="scss">
  label.dropdown {
    display: flex;
    position: relative;
    z-index: 2;

    align-items: center;
    cursor: pointer;

    padding-bottom: 0.2rem;
    border-bottom: solid var(--color-border) 1px;
    margin-bottom: 0.2rem;

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
      margin-bottom: 0;
    }

    p {
      min-width: 0;
      flex: 1 1 0;
    }

    > button {
      pointer-events: none;
      height: 1.25rem;
      font-size: 0.9rem;
      line-height: 0.9;
      margin: 0;

      :global(.lucide) {
        width: 16px;
        height: 16px;
        stroke-width: 2.25px;

        transition: transform 200ms;
      }

      &.rotateChev {
        :global(.lucide) {
          transform: scaleY(-1);
        }
      }
    }

    div.options {
      position: absolute;
      right: 0;
      bottom: 0;

      transform: translateY(100%);

      background-color: var(--color-background);
      border-radius: 0.2rem;
      outline: solid 2px var(--theme-accent-inactive);
      list-style: none;
      padding: 0.4rem;

      display: flex;
      flex-direction: column;

      & > button {
        margin: 0;
        padding: 0.4rem 0.8rem;

        background-color: #fff1;
        outline: solid 2px #0000;
        border-radius: 0.2rem;

        pointer-events: all;

        transition:
          background-color 200ms,
          outline 200ms;

        &:not(:last-of-type) {
          margin-bottom: 0.4rem;
        }

        &:is(:hover, :focus-visible) {
          background-color: #0000;
          outline: solid 2px var(--theme-accent-active);
          filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
        }
      }
    }
  }
</style>
