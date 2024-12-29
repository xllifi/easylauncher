<script lang="ts">
  import { route } from "../../../stores/route.svelte.js"
  import OptionButton from "../components/OptionButton.svelte"

  function goToLogin() {
    $route.overlay.previous = 'settings'
    $route.overlay.current = 'login'
  }
</script>

<main>
  <OptionButton name="Вход в аккаунт" actionLabel="Перейти ко входу" onclick={goToLogin}/>
</main>
