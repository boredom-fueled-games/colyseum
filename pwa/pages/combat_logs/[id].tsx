import CombatReport from 'components/Combat/CombatReport';
import Layout from 'components/Layout';
import { useCombatLog } from 'hooks/combatLogs';
import { useRouter } from 'next/router';

const CombatLogDetails = (): JSX.Element => {
  const Router = useRouter();
  const {id} = Router.query;
  const {combatLog} = useCombatLog(id ? `/combat_logs/${id}` : null);

  if (combatLog) {
    combatLog.characters = combatLog.combatResults.map(
      (result) => ({identifier: result.characterStats.identifier})
    );
  }
  return (
    <Layout
      title={
        combatLog
          ? `${combatLog && combatLog.characters && combatLog.characters[0] && combatLog.characters[0].identifier ? combatLog.characters[0].identifier : ''} vs ${combatLog && combatLog.characters && combatLog.characters[1] && combatLog.characters[1].identifier ? combatLog.characters[1].identifier : ''
          }` : ''}
      disableBreadcrumbs
    >
      {combatLog ? <CombatReport combatLog={combatLog}/> : null}
    </Layout>
  );
};

export default CombatLogDetails;
