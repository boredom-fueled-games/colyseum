import { getHubUrl } from 'adapters/axios';
import { useMercure } from 'adapters/mercure';
import { useCombatLog } from 'hooks/combatLogs';
import { useRouter } from 'next/router';

const CombatLogDetails = (): JSX.Element => {
  const Router = useRouter();
  const {id} = Router.query;
  const {combatLog, loading} = useCombatLog(id ? `/combat_logs/${id}` : null);

  const test = useMercure(combatLog,getHubUrl());
  console.log(test);

  return loading ? <div>Loading...</div> : (<div>{JSON.stringify(combatLog)}</div>);
};

export default CombatLogDetails;
