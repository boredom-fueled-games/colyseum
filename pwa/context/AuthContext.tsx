import { NextRouter, useRouter } from 'next/router';
import { createContext, ReactNode, useContext } from 'react';
import useSWR from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';
import User from 'types/User';

type State =
  {
    user: User | null,
    loading: boolean,
    characters: Collection<Character>,
    loggedOut: boolean,
  } | undefined;

const Context = createContext<State>(undefined);

type ProviderProps = { children: ReactNode }

export const AuthProvider = ({children}: ProviderProps): JSX.Element => {
  const Router = useRouter();
  const {
    data: user,
    error
  } = useSWR<User>(Router.asPath === '/' || Router.asPath.match(/\/characters/) ? '/auth/me' : null);
  const loading = (!user || !user['@id']) && !error;
  const loggedOut = error && (error.status === 401 || error.status === 404);
  const {data: characters} = useSWR<User>(loading || loggedOut ? null : `${user['@id']}/characters`);

  const value: State = {user: loggedOut ? null : user, loading, characters, loggedOut};
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export const AuthContextConsumer = Context.Consumer;

export const useAuth = (): State => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
