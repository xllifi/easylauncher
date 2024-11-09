<script lang="ts">
  import { TriangleAlert } from 'lucide-svelte'

  interface Props {
    name: string
    input?: number
    min: number
    max: number
    step: number
  }
  let {
    name,
    input = $bindable(),
    min,
    max,
    step
  }: Props = $props()

  function verifyInput() {
    if (input > max) {
      input = max
      return
    }
    if (input < min) {
      input = min
      return
    }
    if (!/^\d+$/.test(input)) {
      input = min + max / 2
      return
    }
  }
</script>

<label class="text-input">
  <p>{name}</p>
  <input type="text" bind:value={input} onfocusout={verifyInput}/>
  <input type="range" bind:value={input} min={min} max={max} step={step} />
</label>

<style lang="scss">
  label.text-input {
    display: flex;
    gap: 1rem;

    align-items: center;
    cursor: pointer;

    position: relative;

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

    input[type='text'] {
      max-width: 3rem;
    }

    input[type='range'] {
      width: 12dvw;
      appearance: none;
      background: #0006;
      height: 0.4rem;
      border-radius: 0.2rem;

      &::-webkit-slider-thumb {
        appearance: none;
        width: 0.4rem;
        height: 1.2rem;
        border-radius: 0.2rem;
        background-color: #0006;
        outline: solid 2px var(--theme-accent-inactive);

        cursor: pointer;

        &:hover {
          outline: solid 2px var(--theme-accent-active);
          filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
        }
      }
    }
  }
</style>
