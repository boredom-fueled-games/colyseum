import CharacterStats from 'types/CharacterStats';

export default interface CombatResult {
  '@id': string;
  characterStats: CharacterStats,
  winner: boolean,
}
