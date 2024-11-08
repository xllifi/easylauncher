<script lang="ts">
  import TextInput from '../components/OptionTextInput.svelte'
  import { params } from '../params'

  if ($params.launchParams === undefined) {
    $params.launchParams = {
      maxMem: '6144',
      minMem: '512'
    }
  }
</script>

<!-- TODO: make a designated number input / slider -->
<TextInput name="Макс. ОЗУ" bind:input={$params.launchParams.maxMem} />
<TextInput name="Мин. ОЗУ" bind:input={$params.launchParams.minMem} />
