<script lang="ts">
  import OptionSlider from '../components/OptionSlider.svelte'
  import { params } from '../../stores/params'

  if ($params.launchParams === undefined) {
    $params.launchParams = {
      maxMem: 6144,
      minMem: 512
    }
  }

  function verifyValues(type: string) {
    if ($params.launchParams.minMem <= $params.launchParams.maxMem) {
      return
    }
    switch (type) {
      case 'max':
        $params.launchParams.minMem = $params.launchParams.maxMem
        break
      case 'min':
        $params.launchParams.maxMem = $params.launchParams.minMem
        break
      default:
        break
    }
  }
</script>

<main>
  <OptionSlider oninput={() => verifyValues('max')} name="Макс. мб. ОЗУ" bind:input={$params.launchParams.maxMem} min={0} max={16384} step={512} />
  <OptionSlider oninput={() => verifyValues('min')} name="Мин. мб. ОЗУ" bind:input={$params.launchParams.minMem} min={0} max={16384} step={512} />
</main>
