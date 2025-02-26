<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Login from '../../../shared/Login.svelte'
  import SelectProfile from '../../../shared/SelectProfile.svelte'
  import { fly } from 'svelte/transition'

  interface Props {
    next: Function
  }
  let { next = $bindable() }: Props = $props()

  let substep: number = $state(0)
</script>

{#key substep}
<div class="wrapper" out:fly={{ duration: 300, x: -200 }} in:fly={{ delay: 100, duration: 300, x: 200 }}>
  {#if substep == 0}
    <h1>{$_('modal.login.title')}</h1>
    <Login finishCallback={() => {substep++}}/>
  {:else if substep == 1}
    <h1>{$_('modal.selectprofile.title')}</h1>
    <SelectProfile finishCallback={next}/>
  {:else}
    <h1>{$_('page.onboarding.step2-broke.title')}</h1>
    <p>{$_('page.onboarding.step2-broke.description')}</p>
  {/if}
</div>
{/key}

<style>
  div.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
  }
</style>
