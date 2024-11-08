<script lang="ts">
  import Checkbox from "../components/Checkbox.svelte"
import TextInput from "../components/TextInput.svelte"
  import { params } from "../persisted"
</script>

<TextInput name="Никнейм" bind:input={$params.username}/>
<Checkbox name="Checkbox (not persistent)" />
<Checkbox name="Checkbox (persistent)" bind:checked={$params.testopt}/>
