import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { setAuthorization } from 'adapters/axios';
import User from 'types/User';

const useMe = (accessToken?: string) => {
  const [token, setToken] = useState<string>(null);
  useEffect(() => {
    if (token) {
      setAuthorization(token);
    }
  }, [token]);

  if (accessToken) {
    setToken(accessToken);
  }

  const {data, mutate, error} = useSWR<User>('/auth/me');
  const loading = (!data || !data['@id']) && !error;
  const loggedOut = error && error.status === 401;

  return {
    loading,
    loggedOut,
    user: data,
    mutate
  };
};

export default useMe;
