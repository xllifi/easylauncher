import type { MouseEventHandler } from "svelte/elements";
import type StatusFeed from "../components/StatusFeed.svelte";

export interface ModalProps {
  exit: MouseEventHandler<any>,
  back?: MouseEventHandler<any>,
  statusFeed?: StatusFeed
}
