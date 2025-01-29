<script lang="ts">
  import Step1 from './steps/Step1.svelte'
  import Step2 from './steps/Step2.svelte'
  import Step3 from './steps/Step3.svelte'
  import Step4 from './steps/Step4.svelte'
  import { fly } from 'svelte/transition'
  import { ArrowLeft } from 'lucide-svelte'
  import { route } from '../../stores/route.svelte.js'
  import { params } from '../../stores/params.svelte.js'
  import MainPage from '../main/MainPage.svelte'
  let step: number = $state(0)
  let movingFront: boolean = $state(true)

  function next() {
    movingFront = true
    step++
  }
  function back() {
    movingFront = false
    step--
  }
  function finish() {
    $params.onboardingComplete = true
    $route.page = MainPage
  }
</script>

{#key step}
  <div class="onboarding" out:fly={{ duration: 300, x: movingFront ? -200 : 200 }} in:fly={{ delay: 100, duration: 300, x: movingFront ? 200 : -200 }}>
    {#if step == 0}
      <Step1 {next} />
    {:else if step == 1}
      <Step2 {next} />
    {:else if step == 2}
      <Step3 {next} />
    {:else if step == 3}
      <Step4 {finish} />
    {/if}
  </div>
{/key}
{#if step > 0}
  <button class="back" onclick={back}><ArrowLeft /></button>
{/if}

<style lang="scss">
  button.back {
    position: absolute;
    left: 0.6rem;
    top: 0.6rem;
  }
  div.onboarding {
    position: absolute;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    :global(h1) {
      font-family: Unbounded;
      font-size: 1.6rem;
      margin-bottom: -0.4rem;
    }
    :global(p.description) {
      text-align: center;
      opacity: 0.7;
      font-size: 0.8rem;
      margin-bottom: 0.4rem;
    }
  }
</style>
