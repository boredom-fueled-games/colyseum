import { useCombatLog } from 'hooks/combatLogs';
import { useRouter } from 'next/router';

const CombatLogDetails = () => {
  const Router = useRouter();
  const {id} = Router.query;
  const {combatLog, loading} = useCombatLog(`/combat_logs/${id}`);

  return loading ? <div>Loading...</div> : (<div>{JSON.stringify(combatLog)}</div>);
};

export default CombatLogDetails;
