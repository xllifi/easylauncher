<script lang="ts">
  import { _ } from 'svelte-i18n'
  import OptionButton from '../components/OptionButton.svelte'
  import { ipc } from '../../../../main.js'
  import { defaultParams, params } from '../../../../lib/stores/params.svelte.js'
  import { route } from '../../../../lib/stores/route.svelte.js'

  type Allowed = Array<'assets' | 'instance' | 'java' | 'libraries' | 'version' | 'everything'>
  const arr: Allowed = ['assets', 'instance', 'java', 'libraries', 'version', 'everything']

  function resetParts(resets: Allowed) {
    ipc.send('reset-mc-paths', resets)
  }
  function resetLauncher() {
    $route.loaded = false
    $params = defaultParams
    window.location.reload()
  }
</script>

<main>
  <!-- prettier-ignore -->
  <OptionButton
           name={$_(`modal.settings.pages.reset.options.launcher.name`)}
    description={$_(`modal.settings.pages.reset.options.launcher.description`)}
    actionLabel={$_(`modal.settings.pages.reset.options.launcher.label`)}
        onclick={resetLauncher}
    />
  {#each arr as x}
    <!-- prettier-ignore -->
    <OptionButton
             name={$_(`modal.settings.pages.reset.options.${x}.name`)}
      description={$_(`modal.settings.pages.reset.options.${x}.description`)}
      actionLabel={$_(`modal.settings.pages.reset.options.${x}.label`)}
          onclick={() => resetParts([`${x}`])}
    />
  {/each}
</main>
