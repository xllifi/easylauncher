<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements"
  import { tooltip } from "../../../../lib/actions/tooltip.svelte.js"

  interface Props {
    onclick: MouseEventHandler<HTMLButtonElement>
    name: string
    description: string
    actionLabel: string
  }
  let { onclick, name, description, actionLabel }: Props = $props()
</script>

<label class="button" use:tooltip={[description]}>
  <p>{name}</p>
  <button {onclick} aria-label={name}>{actionLabel}</button>
</label>

<style lang="scss">
  label.button {
    display: flex;
    position: relative;

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

    button {
      height: 1.25rem;
      font-size: 0.9rem;
      line-height: 0.9;
      margin: 0;
    }
  }
</style>
