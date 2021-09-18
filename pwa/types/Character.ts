export interface Character {
  [key: string]: string | number | undefined;
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
