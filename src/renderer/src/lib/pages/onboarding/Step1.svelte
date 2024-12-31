<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements"
  import { route } from "../../stores/route.svelte.js"

  interface Props {
    next: MouseEventHandler<any>
  }
  let { next = $bindable() }: Props = $props()
</script>

<h1>Привет!</h1>
<p>Давай всё настроим...</p>
<button onclick={next}>Далее</button>
<button onclick={() => {$route.page = 'main'}}>Похуй, в меню меня</button>
