import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as cookie from 'cookie';
import * as setCookie from 'set-cookie-parser';

const axiosInstance = axios.create({
  // baseURL: NEXT_PUBLIC_ENTRYPOINT,
  withCredentials: true,
});

createAuthRefreshInterceptor(axiosInstance, failedRequest =>
  axiosInstance.get('/api/refresh').then(resp => {
    if (axiosInstance.defaults.headers.setCookie) {
      delete axiosInstance.defaults.headers.setCookie;
    }

    const {accessToken} = resp.data;
    const bearer = `Bearer ${accessToken}`;
    axiosInstance.defaults.headers.Authorization = bearer;

    const responseCookie = setCookie.parse(resp.headers['set-cookie'])[0]; // 3a. We can't just acces it, we need to parse it first.
    axiosInstance.defaults.headers.setCookie = resp.headers['set-cookie']; // 3b. Set helper cookie for 'authorize.ts' Higher order Function.
    axiosInstance.defaults.headers.cookie = cookie.serialize(
      responseCookie.name,
      responseCookie.value,
    );

    failedRequest.response.config.headers.Authorization = bearer;

    return Promise.resolve();
  }),
);

export default axiosInstance;
