<script lang="ts">
  import { tooltip } from '../../../../lib/actions/tooltip.svelte.js'

  interface Props {
    name: string
    description: string
    input?: string
  }
  let {
    name,
    description,
    input = $bindable()
  }: Props = $props()
</script>

<label class="text-input" use:tooltip={description}>
  <p>{name}</p>
  <input type="text" bind:value={input}>
</label>

<style lang="scss">
  label.text-input {
    display: flex;
    gap: 1rem;

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
  }
</style>
