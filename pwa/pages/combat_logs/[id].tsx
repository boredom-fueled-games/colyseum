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
        combatLog ? `${combatLog.characters[0].identifier} vs ${combatLog.characters[1].identifier
        }` : null} disableBreadcrumbs
    >
      <CombatReport combatLog={combatLog}/>
    </Layout>
  );
};

export default CombatLogDetails;
