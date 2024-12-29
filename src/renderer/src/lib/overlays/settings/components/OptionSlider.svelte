<script lang="ts">
  interface Props {
    name: string
    input?: number
    min: number
    max: number
    step: number
    oninput?: any
  }
  let { name, input = $bindable(), min, max, step, oninput }: Props = $props()

  function verifyInput() {
    if (!input) return
    if (!/^\d+$/.test(input.toString())) {
      input = 0
    }
    if (input > max) {
      input = max
    }
    if (input < min) {
      input = min
    }
    oninput()
  }

  function handleScroll(e: WheelEvent) {
    if (!input) return
    if (e.deltaY < 0) {
      input = input + step
    }
    if (e.deltaY > 0) {
      input = input - step
    }
    verifyInput()
  }
</script>

<label class="text-input">
  <p>{name}</p>
  <input type="text" bind:value={input} onfocusout={verifyInput} />
  <input {oninput} type="range" bind:value={input} {min} {max} {step} onwheel={handleScroll} />
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
      width: 16dvw;
      appearance: none;
      background: #0006;
      height: 0.4rem;
      border-radius: 0.2rem;
      transition: filter 200ms;

      cursor: pointer;

      &::-webkit-slider-thumb {
        appearance: none;
        width: 0.4rem;
        height: 1.2rem;
        border-radius: 0.2rem;
        background-color: #0006;
        outline: solid 2px var(--theme-accent-inactive);
        transition: outline-color 200ms;
      }

      &:hover{
        outline: solid 2px var(--theme-accent-active);
        filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
        &::-webkit-slider-thumb {
          background-color: var(--theme-accent-active);
          outline: solid 4px var(--theme-accent-active);
          outline-offset: -3px;
          // filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
        }
      }
    }
  }
</style>
