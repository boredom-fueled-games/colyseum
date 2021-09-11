import axios from 'axios';
import { ENTRYPOINT } from 'config/entrypoint';
import { NextApiResponse } from 'next';
import withSession, { NextIronRequest } from 'utils/session';

export default withSession(async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    const {session, body} = req;
    let accessToken = session.get<string>('accessToken');
    console.log('login', accessToken);
    if (!accessToken) {
      const {data} = await axios.post(
        `${ENTRYPOINT}/auth/login`,
        body
      );

      accessToken = data.token;
      req.session.set('accessToken', accessToken);
      req.session.set('refreshToken', data.refreshToken);
      await req.session.save();
    }
    if (accessToken) {
      return res.status(200).send({accessToken});
    }
    res.status(401).send(null);
  } catch (error) {
    if (error.response) {
      const {status, data} = error.response;
      return res.status(status).json(data);
    }

    res.status(500).json(error);
  }
});
