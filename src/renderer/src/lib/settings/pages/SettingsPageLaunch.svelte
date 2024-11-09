<script lang="ts">
  import OptionSlider from '../components/OptionSlider.svelte'
  import { params } from '../../stores/params'

  if ($params.launchParams === undefined) {
    $params.launchParams = {
      maxMem: 6144,
      minMem: 512
    }
  }
</script>

<!-- TODO: make a designated number input / slider -->
<OptionSlider name="Макс. мб. ОЗУ" bind:input={$params.launchParams.maxMem} min={0} max={16384} step={512}/>
<OptionSlider name="Мин. мб. ОЗУ" bind:input={$params.launchParams.minMem} min={0} max={16384} step={512}/>
