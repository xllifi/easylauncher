<script lang="ts">
  import OptionCheckbox from "../components/OptionCheckbox.svelte"
  import OptionTextInput from "../components/OptionTextInput.svelte"
  import { params } from "../params"
</script>

<OptionTextInput name="Никнейм" bind:input={$params.username}/>
<OptionCheckbox name="Checkbox (not persistent)" />
<OptionCheckbox name="Checkbox (persistent)" bind:checked={$params.testopt}/>
