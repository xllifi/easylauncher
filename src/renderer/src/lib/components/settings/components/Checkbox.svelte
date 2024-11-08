<script lang="ts">
  interface Props {
    checked?: boolean,
    name: string
  }
  let {
    checked = $bindable(),
    name
  }: Props = $props()
</script>

<label class="checkbox-input">
  <p>{name}</p>
  <input type="checkbox" bind:checked={checked}>
</label>

<style lang="scss">
  label.checkbox-input {
    display: flex;
    position: relative;

    align-items: center;
    cursor: pointer;
    
    input[type="checkbox"] {
      width: 1.25rem;
      appearance: none;
      margin: 0;
      cursor: pointer;
      margin-left: auto;

      &::before {
        content: '';
        display: block;
        width: 100%;
        aspect-ratio: 1/1;
        border: none;
        background-color: #0006;
        border-radius: 0.2rem;
        outline: solid #fff0 2px;

        transition: outline-color 100ms, filter 100ms;
      }
      &:checked::before {
        outline: solid #f55 2px;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>');
        filter: drop-shadow(0 0 3px #a22c);
      }
    }
  }
</style>