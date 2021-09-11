import axios from 'axios';
import { ENTRYPOINT } from 'config/entrypoint';
import { GetServerSidePropsResult } from 'next';
import withSession, { NextIronRequest } from 'utils/session';

interface ServerAuthProps {
  authenticatedRedirect?: string;
  unauthenticatedRedirect?: string;
  customCallback?: (req: NextIronRequest) => GetServerSidePropsResult<any>;
}

export const getServerSideAuth = (
  {
    authenticatedRedirect,
    unauthenticatedRedirect = '/login',
    customCallback = null,
  }: ServerAuthProps = {}) => withSession(
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
  async ({req}) => {
    console.log('getServerSideAuth', req.session.get('accessToken'));
    if (unauthenticatedRedirect !== null && !await refresh(req)) {
      return {
        redirect: {
          destination: unauthenticatedRedirect,
          permanent: false,
        },
      };
    }

    const accessToken = req.session.get<string>('accessToken');

    if (accessToken && authenticatedRedirect) {
      // res.setHeader('location', authenticatedRedirect);
      // res.statusCode = 302;
      // res.end();
      return {
        redirect: {
          destination: authenticatedRedirect,
          permanent: false,
        },
      };
    }

    if (!accessToken && unauthenticatedRedirect) {
      // res.setHeader('location', unauthenticatedRedirect);
      // res.statusCode = 302;
      // res.end();
      return {
        redirect: {
          destination: unauthenticatedRedirect,
          permanent: false,
        },
      };
    }

    if (customCallback) {
      return customCallback(req);
    }

    return {
      props: {accessToken: accessToken ? accessToken : null},
    };
  });

export const refresh = async (req: NextIronRequest): Promise<boolean> => {
  const refreshToken = req.session.get<string>('refreshToken');
  if (!refreshToken) {
    return false;
  }
  try {
    const {data} = await axios.post(
      `${ENTRYPOINT}/auth/refresh`,
      {refreshToken},
    );

    const accessToken = data.token;
    req.session.set('accessToken', accessToken);
    req.session.set('refreshToken', data.refreshToken);
    await req.session.save();

    return true;
  } catch (error) {
    req.session.destroy();
    return false;
  }
};
