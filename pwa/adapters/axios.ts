import { notification } from 'antd';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { ENTRYPOINT } from 'config/entrypoint';

let hubUrl: string | null = null;

let refreshed = false;

const axiosInstance = axios.create({
  baseURL: ENTRYPOINT,
  withCredentials: true,
  validateStatus: (status) => status < 400 || status === 422
});

createAuthRefreshInterceptor(axiosInstance, async () => refreshed ? null :
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

axiosInstance.interceptors.response.use((response) => {
  const {status, data} = response;
  if (status === 422) {
    console.log({response});
    // for(const violation of data.violations) {
    //   message.warning(violation.message);
    // }
    notification['warning']({
      message: data['hydra:title'],
      description: data['hydra:description'],
    });
  }

  return response;
});

export default axiosInstance;

export const getHubUrl = (): string | null => hubUrl;

export const fetcher = async (url: string): Promise<unknown> => {
  refreshed = false;
  try {
    const response = await axiosInstance.get(`/api/proxy${url}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
