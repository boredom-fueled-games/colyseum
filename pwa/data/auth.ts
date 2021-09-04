import useSWR from 'swr';
import axios, { setAuthorization } from 'adapters/axios';

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

const useMe = (accessToken?: string) => {
  if (accessToken) {
    setAuthorization(accessToken);
  }
  const {data, mutate, error} = useSWR('/auth/me', fetcher);

  console.log(data, mutate, error);

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
