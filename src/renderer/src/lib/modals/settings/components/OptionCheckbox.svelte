<script lang="ts">
  import { tooltip } from "../../../actions/tooltip.svelte.js"

  interface Props {
    checked?: boolean
    description: string
    name: string
  }
  let { checked = $bindable(), name, description }: Props = $props()
</script>

<label class="checkbox-input" use:tooltip={description}>
  <p>{name}</p>
  <input type="checkbox" bind:checked />
</label>

<style lang="scss">
  label.checkbox-input {
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

    input[type='checkbox'] {
      width: 1.25rem;
      margin: 0;
      pointer-events: none;
    }
  }
</style>
