export type Settings = {
  pages: SettingsPage[]
}

export type SettingsPage = {
  id: string,
  title: string,
  options: SettingsPageOption[]
}

export type SettingsPageOption = {
  id: string,
  name: string,
  binds_to: string,
  type: string
}