import useSWR from 'swr';
import { setAuthorization } from 'adapters/axios';
import User from 'types/User';


const useMe = (accessToken?: string) => {
  if (accessToken) {
    setAuthorization(accessToken);
  }
  const {data, mutate, error} = useSWR<User>('/auth/me');
  const loading = !data && !error;
  const loggedOut = error && error.status === 401;

  return {
    loading,
    loggedOut,
    user: data,
    mutate
  };
};

export default useMe;
