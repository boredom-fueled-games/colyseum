import { GetServerSidePropsResult } from 'next';
import AuthTokens from 'types/AuthTokens';
import withSession, { NextIronRequest } from 'utils/session';

interface ServerAuthProps {
  authenticatedRedirect?: string;
  unauthenticatedRedirect?: string;
  customCallback?: (req: NextIronRequest) => GetServerSidePropsResult<any>;
}

export const getServerSideAuth = ({
                                    authenticatedRedirect,
                                    unauthenticatedRedirect = '/login',
                                    customCallback = null,
                                  }: ServerAuthProps) => withSession(async ({
                                                                              req,
                                                                              res
                                                                            }) => {
  const tokens = req.session.get<AuthTokens>('tokens');

  if (tokens && tokens.token && authenticatedRedirect) {
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

  if ((!tokens || !tokens.token) && unauthenticatedRedirect) {
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
    return customCallback();
  }

  return {
    props: {token: tokens ? tokens.token : null},
  };
});
