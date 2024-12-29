<script lang="ts">
  import OptionSlider from '../components/OptionSlider.svelte'
  import { params } from '../../../stores/params.js'

  if ($params.launchOpts === undefined) {
    $params.launchOpts = {
      memory: {
        min: 512,
        max: 6144
      },
      screen: {
        width: 854,
        height: 480
      }
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
</main>
