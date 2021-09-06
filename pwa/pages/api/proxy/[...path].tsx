import axios from 'axios';
import { ENTRYPOINT } from 'config/entrypoint';
import withSession from 'utils/session';

const ApiProxy = withSession(async (req, res) => {
  const {session, method} = req;
  const headers = {
    accept: 'application/ld+json',
    'Content-type': 'application/json'
  };

  const accessToken = session.get<string>('accessToken');
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const url = `${ENTRYPOINT}${req.url.replace(/^\/api\/proxy/, '')}`;

  try {
    const {status, data} = await axios.request({url, method, headers});

    res.status(status).json(data);
  } catch (error) {
    if (error.response) {
      const {status, data} = error.response;
      return res.status(status).json(data);
    }

    console.error(error);
    res.status(500).json(null);
  }
});

export default ApiProxy;
