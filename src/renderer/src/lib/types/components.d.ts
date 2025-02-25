export type StatusBarContents = {
  text?: string
  left_text?: string
  right_text_1?: string
  right_text_2?: string
  fillcolor?: string
  progress?: number
  hide_after_secs?: number
}

export type StatusFeedEntry = {
  title: string
  description: string
  id?: number
  /** # Warning! Not implemented!!! */
  remove_after_secs?: number
}
