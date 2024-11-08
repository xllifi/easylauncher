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

    input[type="checkbox"] {
      width: 1.25rem;
      appearance: none;
      margin: 0;
      cursor: pointer;

      &:focus {
        outline: none;
      }

      &::before {
        content: '';
        display: block;
        width: 100%;
        aspect-ratio: 1/1;
        border: none;
        background-color: #0006;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="white" opacity="0.1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>');
        border-radius: 0.2rem;
        outline: solid var(--theme-accent-inactive) 2px;

        transition: outline-color 100ms, filter 100ms, background-color 100ms;
      }
      &:checked::before {
        outline: solid var(--theme-accent-active) 2px;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>');
        filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
      }
      &:not(:checked):is(:hover, :focus)::before {
        outline: solid var(--theme-accent-active) 2px;
        filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
      }
      &:checked:is(:hover, :focus)::before {
        outline-offset: -1px;
        outline-width: 3px;
        background-color: var(--theme-accent-active);
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>');
      }
    }
  }
</style>
