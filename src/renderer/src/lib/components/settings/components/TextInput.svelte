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

    align-items: center;
    cursor: pointer;
    
    input[type="text"] {
      min-width: 0px;
      max-width: 32dvw;
      height: 1.2rem;
      margin: 0;
      background-color: #0006;
      color: var(--text-color);
      font-family: Inter;
      border: none;
      border-radius: 0.2rem;
      margin-left: auto;
      outline: solid #fff0 2px;
      flex-shrink: 1;

      transition: outline-color 100ms, filter 100ms;
      &:focus {
        outline: solid #f55 2px;
        filter: drop-shadow(0 0 3px #a22c);
      }
    }
  }
</style>