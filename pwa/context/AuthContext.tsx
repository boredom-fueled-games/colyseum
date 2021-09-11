import { useCharacter } from 'hooks/characters';
import { NextRouter, useRouter } from 'next/router';
import { createContext, Provider, ReactNode, useContext } from 'react';
import useSWR from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';
import User from 'types/User';

type StateValue =
  { user: User | null, loading: boolean, characters: Collection<Character>, activeCharacter?: Character }
  | undefined;

type AuthProviderProps = { children: ReactNode }

const AuthContext = createContext<StateValue>(undefined);


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

export const AuthProvider = ({children}: AuthProviderProps): JSX.Element => {
  const Router = useRouter();
  const {
    data: user,
    error
  } = useSWR<User>(Router.asPath === '/' || Router.asPath.match(/\/characters/) ? '/auth/me' : null);
  const loading = (!user || !user['@id']) && !error;
  const loggedOut = error && (error.status === 401 || error.status === 404);
  const {data: characters} = useSWR<User>(loading || loggedOut ? null : `/characters?user=${user['@id']}`);

  const activeCharacter = getActiveCharacter(Router, characters ? characters['hydra:member'] : []);

  const value: StateValue = {user: loggedOut ? null : user, loading, characters, activeCharacter};
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextConsumer = AuthContext.Consumer;

export const useAuth = (): StateValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
