<script lang="ts">
  interface Props {
    name: string
    input?: string
  }
  let {
    name,
    input = $bindable()
  }: Props = $props()
</script>

<label class="text-input">
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
      border-bottom: none;
    }

    p {
      min-width: 0;
      flex: 1 1 0;
    }

    input[type="text"] {
      min-width: 0;
      width: 4rem;
      max-width: 12rem;
      flex: 1 1 0;
      
      height: 1.25rem;
      background-color: #0006;
      color: var(--text-color);
      font-family: Inter;
      font-weight: 460;
      padding: 0 0.2rem;
      border: none;
      border-radius: 0.2rem;
      outline: solid #fff1 2px;

      transition: outline-color 100ms, filter 100ms;
      &:focus {
        outline: solid #f55 2px;
        filter: drop-shadow(0 0 3px #b33c);
      }
    }
  }
</style>
