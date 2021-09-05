import axios from 'axios';
import { ENTRYPOINT } from 'config/entrypoint';
import { NextApiResponse } from 'next';
import AuthTokens from 'types/AuthTokens';
import withSession, { NextIronRequest } from 'utils/session';

export default withSession(async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    let currentTokens = req.session.get<AuthTokens>('tokens');
    if (!currentTokens) {
      const {data} = await axios.post(
        `${ENTRYPOINT}/auth/login`,
        req.body
      );

      req.session.set('tokens', data);
      currentTokens = data;
      await req.session.save();
    }

    const token = (currentTokens ? currentTokens.token : null);
    res.send({token});
  } catch (error) {
    if (error.response) {
      const {status, data} = error.response;
      return res.status(status).json(data);
    }

    res.status(500).json(error);
  }
});
