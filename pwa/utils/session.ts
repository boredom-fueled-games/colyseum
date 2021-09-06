import { NextApiRequest, NextApiResponse } from 'next';
import { Session, withIronSession } from 'next-iron-session';

export type NextIronRequest = NextApiRequest & { session: Session };

export type NextIronHandler = (
  req: NextIronRequest,
  res: NextApiResponse,
) => void | Promise<void>;

const withSession = (handler: NextIronHandler): unknown =>
  withIronSession(handler, {
    password: 'change me!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', //TODO change with env
    cookieName: 'next', //TODO change with env
    cookieOptions: {
      secure: true,
    },
  });

export default withSession;
