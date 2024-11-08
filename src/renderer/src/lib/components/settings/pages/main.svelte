<script>
  import Checkbox from "../components/Checkbox.svelte"
  import { params } from "../persisted"

</script>
<Checkbox name="opt1" bind:checked={$params.opt1}/>