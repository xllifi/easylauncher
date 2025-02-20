<script lang="ts">
  import { _ } from "svelte-i18n"
  import type { MouseEventHandler } from "svelte/elements"

  interface Props {
    next: MouseEventHandler<any>
  }
  let { next = $bindable() }: Props = $props()
</script>

<h1>{$_('page.onboarding.welcome.title')}</h1>
<p>{$_('page.onboarding.welcome.description')}</p>
<button onclick={next}>{$_('page.onboarding.welcome.button')}</button>
