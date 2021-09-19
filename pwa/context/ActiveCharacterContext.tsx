import axios from 'adapters/axios';
import { useAuth } from 'context/AuthContext';
import { NextRouter, useRouter } from 'next/router';
import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import useSWRImmutable from 'swr/immutable';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';
import Item from 'types/Item';
import { ChangeCharacterStatsAction, CharacterStats } from 'types/Stats';

type ActiveCharacterState =
  {
    activeCharacter?: Character | null,
    stats: CharacterStats | null,
    changeStats: Dispatch<ChangeCharacterStatsAction>,
    saveCharacter: () => Promise<void>
    equippedItems: Item[]
  };

const Context = createContext<ActiveCharacterState>({
  activeCharacter: null,
  stats: null,
  changeStats: (value: ChangeCharacterStatsAction):void => {console.error('Should never be called!')},
  saveCharacter(): Promise<void> {
    return Promise.resolve(undefined);
  },
  equippedItems: []
});

const getActiveCharacter = (Router: NextRouter, characters: Character[]): Character|null => {
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
    stats.level = character.level || 1;
    stats.strength = character.strength || 10;
    stats.dexterity = character.dexterity || 10;
    stats.constitution = character.constitution || 10;
    stats.intelligence = character.intelligence || 10;
  }

  const value = action.value;
  const reg = /^-?\d*(\.\d*)?$/;
  if (value && reg.test(value.toString())) {
    let numberValue = parseInt(value.toString());
    if (numberValue < (character[action.type] || 10)) {
      return stats;
    }

    if (numberValue - stats.free > stats[action.type]) {
      numberValue = (stats[action.type] as number) + stats.free;
    }

    stats[action.type] = numberValue as number & Character;
  }

  stats.free = 40 + ((stats.level - 1) * 4) - stats.strength - stats.dexterity - stats.constitution - stats.intelligence;
  return {...stats};
};

type ProviderProps = { children: ReactNode }

export const ActiveCharacterProvider = ({children}: ProviderProps): JSX.Element => {
  const Router = useRouter();
  const {user, ownedItems} = useAuth();
  const {data: characters, mutate} = useSWRImmutable<Collection<Character>>(!user ? null : `${user['@id']}/characters`);

  const [stats, changeStats] = useReducer(statReducer, {
    level: 1,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    free: 0
  });

  const activeCharacter = getActiveCharacter(Router, characters && characters['hydra:member'] ? characters['hydra:member'] : []);
  const equippedItems: Item[] = activeCharacter && ownedItems && ownedItems['hydra:member']
    ? ownedItems['hydra:member']
      .filter((ownedItem) => ownedItem.character === activeCharacter['@id'])
      .map((equippedItem) => ({
        ...equippedItem.item,
        '@id': equippedItem['@id'],
        durability: equippedItem.durability
      }))
    : [];
  const saveCharacter = async () => {
    if (!activeCharacter) {
      return;
    }

    await axios.patch(`/api/proxy${activeCharacter['@id']}`, stats);
    mutate();
  };

  const value: ActiveCharacterState = {activeCharacter, stats, changeStats, saveCharacter, equippedItems};
  return (<Context.Provider value={value}>{children}</Context.Provider>);
};

export const ActiveCharacterContextConsumer = Context.Consumer;

export const useActiveCharacter = (): ActiveCharacterState => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useActiveCharacter must be used within a ActiveCharacterProvider');
  }
  return context;
};
