import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';
import OwnedItem from 'types/OwnedItem';
import User from 'types/User';

type AuthState =
  {
    user: User | null | undefined,
    loading: boolean,
    characters: Collection<Character> | undefined,
    ownedItems: Collection<OwnedItem> | undefined,
    loggedOut: boolean,
    mutateOwnedItems: KeyedMutator<Collection<OwnedItem>>
  };

const Context = createContext<AuthState>({
  user: null,
  loading: true,
  characters: undefined,
  ownedItems: undefined,
  loggedOut: true,
  mutateOwnedItems: async () => undefined,
});

type ProviderProps = { children: ReactNode }

export const AuthProvider = ({children}: ProviderProps): JSX.Element => {
  const Router = useRouter();
  const {
    data: user,
    error
  } = useSWR<User>(Router.asPath === '/' || Router.asPath.match(/\/characters/) ? '/auth/me' : null);
  const loading = (!user || !user['@id']) && !error;
  const loggedOut = error && (error.status === 401 || error.status === 404);
  const {data: characters} = useSWR<Collection<Character>>(!user || loggedOut ? null : `${user['@id']}/characters`);
  const {
    data: ownedItems,
    mutate: mutateOwnedItems
  } = useSWR<Collection<OwnedItem>>(!user || loggedOut ? null : `/owned_items?user=${user['@id']}`);

  const value: AuthState = {
    user: loggedOut ? null : user,
    loading,
    characters,
    ownedItems,
    loggedOut,
    mutateOwnedItems
  };
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export const AuthContextConsumer = Context.Consumer;

export const useAuth = (): AuthState => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
