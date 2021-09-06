import axios from 'axios';
import { ENTRYPOINT } from 'config/entrypoint';
import { NextApiResponse } from 'next';
import withSession, { NextIronRequest } from 'utils/session';

export default withSession(async (req: NextIronRequest, res: NextApiResponse) => {
  const refreshToken = req.session.get<string>('refreshToken');
  if (!refreshToken) {
    return res.status(404).json(null); //TODO better message
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

    res.status(200).json(null);
  } catch (error) {
    if (error.response) {
      console.log(error);
      const {status, data} = error.response;
      return res.status(status).json(data);
    }

    res.status(500).json(error);
  }
});
