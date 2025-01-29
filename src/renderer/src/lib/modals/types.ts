import type { SvelteComponent } from 'svelte'
import type { MouseEventHandler } from 'svelte/elements'

export interface ModalProps {
  exit: MouseEventHandler<any>
  back?: MouseEventHandler<any>
  statusFeed?: SvelteComponent
}
