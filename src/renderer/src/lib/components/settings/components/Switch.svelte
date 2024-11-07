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

<label class="switch-input">
  <input type="checkbox" bind:checked={checked}>
  <p>{name}</p>
</label>

<style lang="scss">
  label.switch-input {
    display: flex;

    align-items: center;
    cursor: pointer;
    
    input[type="checkbox"] {
      width: 1.25rem;
      appearance: none;
      margin: 0;
      cursor: pointer;

      &::before {
        content: '';
        display: block;
        width: 100%;
        aspect-ratio: 1/1;
        border: none;
        background-color: #0006;
        border-radius: 0.2rem;

        transition: background-color 100ms, filter 100ms;
      }
      &:checked::before {
        background-color: #c44;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>');
        filter: drop-shadow(0 0 3px #a22c);
      }
    }
    p {
      margin-left: 0.4rem;
    }
  }
</style>