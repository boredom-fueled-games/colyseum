import useSWR from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';
import CombatLog from 'types/CombatLog';

const baseIRI = '/combat_logs';

export const useCombatLogs = (character: Character|null = null) => {
  const {
    data,
    error
  } = useSWR<Collection<CombatLog>>(`${baseIRI}?order[startedAt]=desc${(character && character['@id'] ? '&characters=' + character['@id'] : '')}`);
  const loading = !data && !error;

  return {
    loading,
    combatLogs: data,
  };
};

export const useCombatLog = (id: string | null) => {
  const {data, error} = useSWR<CombatLog>(id ? id : null);
  const loading = !data && !error;

  return {
    loading,
    combatLog: data,
  };
};
