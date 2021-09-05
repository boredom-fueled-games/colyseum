import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { ENTRYPOINT } from 'config/entrypoint';

let bearer: string = null;

const axiosInstance = axios.create({
  baseURL: ENTRYPOINT,
  withCredentials: true,
});

createAuthRefreshInterceptor(axiosInstance, failedRequest =>
  axiosInstance.get('/api/refresh').then(resp => {

    const {token} = resp.data;
    bearer = `Bearer ${token}`;
    axiosInstance.defaults.headers.Authorization = bearer;

    failedRequest.response.config.headers.Authorization = bearer;
    return Promise.resolve();
  }),
);

axiosInstance.interceptors.request.use(request => {
  request.headers['Authorization'] = bearer;
  return request;
});

export default axiosInstance;

export const setAuthorization = (token: string) => {
  bearer = `Bearer ${token}`;
  axiosInstance.defaults.headers.Authorization = bearer;
};

export const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};
