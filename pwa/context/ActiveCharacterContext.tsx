import axios from 'adapters/axios';
import { useAuth } from 'context/AuthContext';
import { NextRouter, useRouter } from 'next/router';
import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import useSWR from 'swr';
import { Character } from 'types/Character';
import { ChangeCharacterStatsAction, CharacterStats } from 'types/Stats';
import User from 'types/User';

type State =
  {
    activeCharacter?: Character,
    stats: CharacterStats,
    changeStats: Dispatch<ChangeCharacterStatsAction>,
    saveCharacter: () => Promise<void>
  } | undefined;

const Context = createContext<State>(undefined);

const getActiveCharacter = (Router: NextRouter, characters: Character[]): Character => {
  let count = 0;
  const parts = Router.asPath.split('/').slice(0, 3);
  const links = parts.map(() => parts.slice(0, ++count).join('/')).slice(2);
  const characterId = links.length === 0 || links[0] === '/characters/[id]' ? null : links[0];

  if (!characterId) {
    return null;
  }

  for (const character of characters) {
    if (character['@id'] !== characterId) {
      continue;
    }
    return character;
  }
  return null;
};

const statReducer = (stats: CharacterStats, action: ChangeCharacterStatsAction): CharacterStats => {
  const character = action.character;
  if (!character) {
    return stats;
  }

  if (action.type === 'character') {
    stats.level = character.level;
    stats.strength = character.strength;
    stats.dexterity = character.dexterity;
    stats.constitution = character.constitution;
    stats.intelligence = character.intelligence;
    stats.changed = false;
  }

  const value = action.value;
  const reg = /^-?\d*(\.\d*)?$/;
  if (value && reg.test(value.toString())) {
    let numberValue = parseInt(value.toString());
    if (numberValue < character[action.type]) {
      return stats;
    }

    if (numberValue - stats.free > stats[action.type]) {
      numberValue = stats[action.type] + stats.free;
    }

    stats.changed = true;
    stats[action.type] = numberValue as number & Character;
  }

  stats.free = 40 + ((stats.level - 1) * 4) - stats.strength - stats.dexterity - stats.constitution - stats.intelligence;
  return {...stats};
};

type ProviderProps = { children: ReactNode }

export const ActiveCharacterProvider = ({children}: ProviderProps): JSX.Element => {
  const Router = useRouter();
  const {user, loading, loggedOut} = useAuth();
  const {data: characters, mutate} = useSWR<User>(loading || loggedOut ? null : `${user['@id']}/characters`);

  const [stats, changeStats] = useReducer(statReducer, {
    level: 1,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    free: 0,
    changed: false
  });

  const activeCharacter = getActiveCharacter(Router, characters ? characters['hydra:member'] : []);
  const saveCharacter = async () => {
    if (!activeCharacter) {
      return;
    }

    await axios.patch(`/api/proxy${activeCharacter['@id']}`, stats);
    mutate();
  };

  const value: State = {activeCharacter, stats, changeStats, saveCharacter};
  return (<Context.Provider value={value}>{children}</Context.Provider>);
};

export const ActiveCharacterContextConsumer = Context.Consumer;

export const useActiveCharacter = (): State => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useActiveCharacter must be used within a ActiveCharacterProvider');
  }
  return context;
};
