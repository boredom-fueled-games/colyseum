import CharacterStats from 'types/CharacterStats';

export default interface CombatRound {
  '@id': string;
  attacker: string,
  defender: string,
  attackerStats: CharacterStats,
  defenderStats: CharacterStats,
  evaded: boolean,
  blocked: boolean,
  damageDealt: number,
  createdAt: Date,
}
