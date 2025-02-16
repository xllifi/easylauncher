export type StatusFeedEntry = {
  title: string
  description: string
  add?: {
    values: {[key: string]: string}
  }
  id?: number
  /** # Warning! Not implemented!!! */
  remove_after_secs?: number
}
