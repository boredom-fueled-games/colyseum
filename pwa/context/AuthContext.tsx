import { createContext, ReactNode, useContext } from 'react';
import useSWR from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';
import User from 'types/User';

type Action = { type: 'increment' } | { type: 'decrement' }
// type Dispatch = (action: Action) => void
// type StateValue = { state: State; dispatch: Dispatch } | undefined;
type StateValue = { user: User | null, loading: boolean, characters: Collection<Character> } | undefined;

// type State = {
//   accessToken?: string;
// }
type AuthProviderProps = { children: ReactNode }

const AuthContext = createContext<StateValue>(undefined);

// const countReducer = (state: State, action: Action) => {
//   switch (action.type) {
//     case 'increment': {
//       return {count: state.count + 1};
//     }
//     default: {
//       throw new Error(`Unhandled action type: ${action.type}`);
//     }
//   }
// };

export const AuthProvider = ({children}: AuthProviderProps) => {
  const {data, error} = useSWR<User>('/auth/me');
  const loading = (!data || !data['@id']) && !error;
  const {data: characters} = useSWR<User>(loading ? null : '/characters');
  const loggedOut = error && error.status === 401;


  // const [state, dispatch] = useReducer(countReducer, {count: 0});
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
