import CombatReport from 'components/Combat/CombatReport';
import Layout from 'components/Layout';
import { useActiveCharacter } from 'context/ActiveCharacterContext';
import { useCombatLog } from 'hooks/combatLogs';
import { useRouter } from 'next/router';

const CombatLogDetails = (): JSX.Element => {
    const router = useRouter();
    const {activeCharacter} = useActiveCharacter();
    const {combatLogId} = router.query;
    const {combatLog} = useCombatLog(combatLogId ? `/combat_logs/${combatLogId}` : null);

    if (combatLog) {
      combatLog.characters = combatLog.combatResults.map(
        (result) => ({identifier: result.characterStats.identifier})
      );
    }

    return (
      <Layout
        title={
          combatLog ? `${combatLog.characters[0].identifier} vs ${combatLog.characters[1].identifier
          }` : null}
        onBack={() => router.push(activeCharacter['@id'])}
      >
        <CombatReport combatLog={combatLog}/>
      </Layout>
    );
  }
;

export default CombatLogDetails;
