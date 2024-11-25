<script lang="ts">
  import OptionCheckbox from "../components/OptionCheckbox.svelte"
  import OptionTextInput from "../components/OptionTextInput.svelte"
  import { params } from "../../stores/params"
  import OptionButton from "../components/OptionButton.svelte"
</script>

<main>
  <OptionTextInput name="Никнейм" bind:input={$params.username}/>
  <OptionCheckbox name="Checkbox (not persistent)" />
  <OptionCheckbox name="Checkbox (persistent)" bind:checked={$params.testopt}/>
  <OptionButton name="Вход в аккаунт" actionLabel="Войти!" onclick={() => console.log('cliccked')}/>
</main>
