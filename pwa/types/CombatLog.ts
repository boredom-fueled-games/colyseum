import CombatResult from 'types/CombatResult';
import CombatRound from 'types/CombatRound';

export default interface CombatLog {
  '@id': string;
  'combatRounds': CombatRound[],
  'combatResults': CombatResult[],
}
