<script lang="ts">
  import OptionSlider from '../components/OptionSlider.svelte'
  import { params } from '../../../../lib/stores/params.svelte.js'
  import OptionCheckbox from '../components/OptionCheckbox.svelte'
  import { _ } from 'svelte-i18n'

  if ($params.shared.launchOpts === undefined) {
    $params.shared.launchOpts = {
      memory: {
        min: 512,
        max: 6144
      },
      screen: {
        width: 854,
        height: 480
      },
      detached: true
    }
  }

  function verifyValues(type: string) {
    if ($params.shared.launchOpts.memory.min <= $params.shared.launchOpts.memory.max) {
      return
    }
    switch (type) {
      case 'max':
        $params.shared.launchOpts.memory.min = $params.shared.launchOpts.memory.max
        break
      case 'min':
        $params.shared.launchOpts.memory.max = $params.shared.launchOpts.memory.min
        break
      default:
        break
    }
  }
</script>

<main>
  <OptionSlider oninput={() => verifyValues('max')} name={$_('modal.settings.pages.launch.options.maxram.name')} description={$_('modal.settings.pages.launch.options.maxram.description')} bind:input={$params.shared.launchOpts.memory.max} min={0} max={16384} step={512} />
  <OptionSlider oninput={() => verifyValues('min')} name={$_('modal.settings.pages.launch.options.minram.name')} description={$_('modal.settings.pages.launch.options.minram.description')} bind:input={$params.shared.launchOpts.memory.min} min={0} max={16384} step={512} />
  <OptionSlider name={$_('modal.settings.pages.launch.options.screenwidth.name')} description={$_('modal.settings.pages.launch.options.screenwidth.description')} bind:input={$params.shared.launchOpts.screen.width} min={0} max={3840} step={120} />
  <OptionSlider name={$_('modal.settings.pages.launch.options.screenheight.name')} description={$_('modal.settings.pages.launch.options.screenheight.description')} bind:input={$params.shared.launchOpts.screen.height} min={0} max={2160} step={120} />
  <OptionCheckbox name={$_('modal.settings.pages.launch.options.detached.name')} description={$_('modal.settings.pages.launch.options.detached.description')} bind:checked={$params.shared.launchOpts.detached}/>
</main>
