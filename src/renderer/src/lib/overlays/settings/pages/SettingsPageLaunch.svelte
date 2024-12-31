<script lang="ts">
  import OptionSlider from '../components/OptionSlider.svelte'
  import { params } from '../../../stores/params.svelte.js'
  import OptionCheckbox from '../components/OptionCheckbox.svelte'

  if ($params.launchOpts === undefined) {
    $params.launchOpts = {
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
    if ($params.launchOpts.memory.min <= $params.launchOpts.memory.max) {
      return
    }
    switch (type) {
      case 'max':
        $params.launchOpts.memory.min = $params.launchOpts.memory.max
        break
      case 'min':
        $params.launchOpts.memory.max = $params.launchOpts.memory.min
        break
      default:
        break
    }
  }
</script>

<main>
  <OptionSlider oninput={() => verifyValues('max')} name="Макс. мб. ОЗУ" bind:input={$params.launchOpts.memory.max} min={0} max={16384} step={512} />
  <OptionSlider oninput={() => verifyValues('min')} name="Мин. мб. ОЗУ" bind:input={$params.launchOpts.memory.min} min={0} max={16384} step={512} />
  <OptionSlider name="Ширина окна" bind:input={$params.launchOpts.screen.width} min={0} max={3840} step={120} />
  <OptionSlider name="Высота окна" bind:input={$params.launchOpts.screen.height} min={0} max={2160} step={120} />
  <OptionCheckbox name="Отвязать лаунчер от Minecraft" bind:checked={$params.launchOpts.detached}/>
</main>
