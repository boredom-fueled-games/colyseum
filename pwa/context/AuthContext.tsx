import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext } from 'react';
import useSWRImmutable from 'swr/immutable';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';
import User from 'types/User';

type AuthState =
  {
    user: User | null | undefined,
    loading: boolean,
    characters: Collection<Character> | undefined,
    loggedOut: boolean,
  };

const Context = createContext<AuthState>({user:null,loading:true,characters:undefined,loggedOut: true});

type ProviderProps = { children: ReactNode }

export const AuthProvider = ({children}: ProviderProps): JSX.Element => {
  const Router = useRouter();
  const {
    data: user,
    error
  } = useSWRImmutable<User>(Router.asPath === '/' || Router.asPath.match(/\/characters/) ? '/auth/me' : null);
  const loading = (!user || !user['@id']) && !error;
  const loggedOut = error && (error.status === 401 || error.status === 404);
  const {data: characters} = useSWRImmutable<User>(!user || loggedOut ? null : `${user['@id']}/characters`);

  const value: AuthState = {user: loggedOut ? null : user, loading, characters, loggedOut};
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
