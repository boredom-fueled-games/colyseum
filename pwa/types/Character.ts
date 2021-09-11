export interface Character {
  '@id'?: string
  identifier: string
  user?: string
  wins?: number
  losses?: number
  level?: number
  experience?: number
  experienceTillNextLevel?: number
  strength?: number
  dexterity?: number
  constitution?: number
  intelligence?: number
}
