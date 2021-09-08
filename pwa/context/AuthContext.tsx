import { createContext, ReactNode, useContext } from 'react';
import useSWR from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';
import User from 'types/User';

type StateValue = { user: User | null, loading: boolean, characters: Collection<Character> } | undefined;


type AuthProviderProps = { children: ReactNode }

const AuthContext = createContext<StateValue>(undefined);

export const AuthProvider = ({children}: AuthProviderProps) => {
  const {data, error} = useSWR<User>('/auth/me');
  const loading = (!data || !data['@id']) && !error;
  const {data: characters} = useSWR<User>(loading ? null : `/characters?user=${data['@id']}`);
  const loggedOut = error && error.status === 401;

  const value: StateValue = {user: loggedOut ? null : data, loading, characters};
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
