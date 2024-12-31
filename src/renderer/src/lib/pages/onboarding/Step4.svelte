<script lang="ts">
  interface Props {
    finish: Function
  }
  let { finish = $bindable() }: Props = $props()
</script>

<h1>Настройка закончена!</h1>
<p class="description">На этом всё, можно использовать лаунчер. Нажмите на кнопку ниже, чтобы перейти на главный экран.</p>
<button onclick={() => {finish()}}>Перейти в лаунчер</button>

<style lang="scss">
  p {
    margin: 0 4rem;
  }
</style>
