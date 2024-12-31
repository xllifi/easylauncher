<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements"

  interface Props {
    next: MouseEventHandler<any>
  }
  let { next = $bindable() }: Props = $props()
</script>

<h1>Привет!</h1>
<p>Давай всё настроим...</p>
<button onclick={next}>Далее</button>
