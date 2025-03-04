<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Login from '../../../shared/Login.svelte'
  import SelectProfile from '../../../shared/SelectProfile.svelte'
  import { fly } from 'svelte/transition'
  import { params } from '../../../../lib/stores/params.svelte.js'

  interface Props {
    next: Function
  }
  let { next = $bindable() }: Props = $props()

  let substep: number = $state(0)

  function maybeOpenProfileSelection() {
    if (!$params.draslApiUser) {
      return
    }
    if ($params.draslApiUser?.user.players.length > 1) {
      substep = 1
    } else {
      $params.successfullLogin = true
      next()
    }
  }
</script>

{#key substep}
  <div class="wrapper" out:fly={{ duration: 300, x: -200 }} in:fly={{ delay: 100, duration: 300, x: 200 }}>
    {#if substep == 0}
      <h1>{$_('modal.login.title')}</h1>
      <Login finishCallback={maybeOpenProfileSelection}/>
    {:else if substep == 1}
      <h1>{$_('modal.selectprofile.title')}</h1>
      <SelectProfile finishCallback={next} />
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
    justify-content: safe center;
    align-items: center;
    overflow-y: scroll;
    padding: 1rem 0;

    height: 100%;

    h1 {
      text-align: center;
    }
  }
</style>
