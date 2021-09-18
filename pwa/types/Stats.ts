import { Character } from 'types/Character';

export const StatTypes = ['strength', 'dexterity', 'constitution', 'intelligence'];
export type Stats = typeof StatTypes[number];

export type CharacterStats = {
  [key: string]: number;
  level: number,
  strength: number,
  dexterity: number,
  constitution: number,
  intelligence: number,
  free: number,
  // changed: boolean,
}

export type ChangeCharacterStatsAction = {
  type: 'character' | Stats
  value?: number | string
  character: Character
}
