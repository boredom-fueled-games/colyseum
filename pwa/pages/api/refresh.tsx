import axios from 'axios';
import { ENTRYPOINT } from 'config/entrypoint';
import { NextApiResponse } from 'next';
import AuthTokens from 'types/AuthTokens';
import withSession, { NextIronRequest } from 'utils/session';

export default withSession(async (req: NextIronRequest, res: NextApiResponse) => {
  const currentTokens = req.session.get<AuthTokens>('tokens');
  if (!currentTokens) {
    return res.status(401).json({}); //TODO better message
  }

  try {
    const {data} = await axios.post(
      `${ENTRYPOINT}/auth/refresh`,
      {refreshToken: currentTokens.refreshToken},
      {
        headers: {
          Authorization: `Bearer ${currentTokens.refreshToken}`
        },
      },
    );

    req.session.set('tokens', data);
    await req.session.save();

    res.status(200).json({token: data.token});
  } catch (error) {
    res.send(error);
  }
});
