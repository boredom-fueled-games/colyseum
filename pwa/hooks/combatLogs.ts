import useSWR, { mutate } from 'swr';
import { Collection } from 'types/Collection';
import CombatLog from 'types/CombatLog';

const baseIRI = '/combat_logs';

export const useCombatLogs = (character?: string) => {
  const {data, error} = useSWR<Collection<CombatLog>>(baseIRI + (character ? '?characters=' + character : ''));
  // const {data, error} = useSWR<Collection<CombatLog>>((character ? character : '') + baseIRI);
  const loading = !data && !error;


  const preload = (id: string) => {
    let existingCombatLogs = null;
    for (const combatLog of data['hydra:member']) {
      if (combatLog['@id'] !== id) {
        continue;
      }
      existingCombatLogs = combatLog;
      break;
    }

    mutate(id, existingCombatLogs);
  };

  return {
    loading,
    preload,
    combatLogs: data,
  };
};

export const useCombatLog = (id: string) => {
  const {data, error} = useSWR<CombatLog>(id ? id : null);
  const loading = !data && !error;

  return {
    loading,
    combatLog: data,
  };
};
