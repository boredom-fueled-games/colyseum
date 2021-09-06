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
  }: ServerAuthProps) => withSession(async ({
                                              req,
                                              res
                                            }) => {
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
    return customCallback();
  }

  return {
    props: {accessToken: accessToken ? accessToken : null},
  };
});
