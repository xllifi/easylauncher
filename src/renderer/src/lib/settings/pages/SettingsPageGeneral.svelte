<script lang="ts">
  import Checkbox from "../components/OptionCheckbox.svelte"
  import TextInput from "../components/OptionTextInput.svelte"
  import { params } from "../params"
</script>

<TextInput name="Никнейм" bind:input={$params.username}/>
<Checkbox name="Checkbox (not persistent)" />
<Checkbox name="Checkbox (persistent)" bind:checked={$params.testopt}/>
