import { atom, selector } from 'recoil';
import { User } from 'types/User';
import axios, { setAuthorization } from 'adapters/axios';

export const loadingState = atom<boolean>({
  key: 'authLoadingState',
  default: true,
});

export const meState = atom<User>({
  key: 'authMeState',
  default: null,
});

export const authTokenState = atom<string>({
  key: 'authTokenState',
  default: null,
});

export const meSelector = selector<User>({
  key: 'authMeSelector',
  get: async ({get}) => {
    const me = get(meState);
    if (me) {
      return me;
    }

    const authToken = get(authTokenState);
    if (!authToken) {
      return null;
    }

    setAuthorization(authToken);
    const response = await axios.get('/auth/me');
    return response.data;
  },
});
