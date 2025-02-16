<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte'
  import { route } from '../../stores/route.svelte.js'
  import MainPage from '../main/MainPage.svelte'
</script>

<div class="title">
  <button class="back" onclick={() => {$route.page = MainPage}}><ArrowLeft /></button>
  <h1 class="text">Управление аккаунтом</h1>
</div>
<div class="content">
</div>

<style lang="scss">
  div.title {
    border-bottom: solid 1px var(--color-border);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    padding: 0.2rem;

    > * {
      grid-row: 1;
      grid-column: 1;
    }
    button {
      z-index: 2;
    }
    h1.text {
      text-align: center;
    }
  }
</style>
