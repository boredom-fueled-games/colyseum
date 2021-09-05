import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { ENTRYPOINT } from 'config/entrypoint';

let bearer: string = null;

let hubUrl: string = null;

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

axiosInstance.interceptors.response.use((response) => {
  if (!hubUrl && response.status < 300) {
    const link = response.headers.link;
    if (link) {
      const matches = link.match(
        /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
      );
      hubUrl = matches && matches[1] ? (new URL(matches[1], ENTRYPOINT)).toString() : null;
    }
  }

  return response;
});

export default axiosInstance;

export const setAuthorization = (token: string) => {
  bearer = `Bearer ${token}`;
  axiosInstance.defaults.headers.Authorization = bearer;
};

export const getHubUrl = () => hubUrl;

export const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};
