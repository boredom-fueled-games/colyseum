import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { ENTRYPOINT } from 'config/entrypoint';

let hubUrl: string = null;

let refreshed = false;

const axiosInstance = axios.create({
  baseURL: ENTRYPOINT,
  withCredentials: true,
});

createAuthRefreshInterceptor(axiosInstance, () => refreshed ? null :
  axiosInstance.get('/api/refresh').then(() => {
    refreshed = true;
  }).then(() => Promise.resolve()),
);

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

export const getHubUrl = (): string => hubUrl;

export const fetcher = async (url: string): Promise<unknown> => {
  refreshed = false;
  try {
    const response = await axiosInstance.get(`/api/proxy${url}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};
