export type DraslPlayer = {
  userUuid: string
  name: string
  uuid: string
  offlineUuid: string
  fallbackPlayer: string
  skinModel: string
  skinUrl: string
  capeUrl: string
  createdAt: string
  nameLastChangedAt: string
}

export type DraslUser = {
  isAdmin: boolean
  isLocked: boolean
  uuid: string
  username: string
  preferredLanguage: string
  players: DraslPlayer[]
  maxPlayerCount: number
}

export type DraslApiUser = {
  user: DraslUser
  token: string
}
