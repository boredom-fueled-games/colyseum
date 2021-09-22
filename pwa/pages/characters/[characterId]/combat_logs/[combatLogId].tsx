import CombatReport from 'components/Combat/CombatReport';
import Layout from 'components/Layout';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { useCombatLog } from 'hooks/combatLogs';
import { useRouter } from 'next/router';
import { Character } from 'types/Character';

const CombatLogDetails = (): JSX.Element => {
  const router = useRouter();
  const {activeCharacter} = useActiveCharacter();
  const {combatLogId} = router.query;
  const {combatLog} = useCombatLog(combatLogId ? `/combat_logs/${combatLogId}` : null);

  if (combatLog) {
    combatLog.characters = combatLog.combatResults.map(
      (result) => ({identifier: result.characterStats.identifier})
    ) as Character[];
  }

  return (
    <Layout
      title={
        combatLog
          ? `${combatLog && combatLog.characters && combatLog.characters[0] && combatLog.characters[0].identifier ? combatLog.characters[0].identifier : ''} vs ${combatLog && combatLog.characters && combatLog.characters[1] && combatLog.characters[1].identifier ? combatLog.characters[1].identifier : ''
          }` : ''}
      onBack={() => activeCharacter && activeCharacter['@id'] ? router.push(activeCharacter['@id']) : null}
    >
      {combatLog ? <CombatReport combatLog={combatLog}/> : null}
    </Layout>
  );
};

export default CombatLogDetails;
