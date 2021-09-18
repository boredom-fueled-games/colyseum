import axios, { Method } from 'axios';
import { ENTRYPOINT } from 'config/entrypoint';
import withSession from 'utils/session';

const ApiProxy = withSession(async (req, res) => {
  const {session, method, body} = req;
  const headers: { [key: string]: string } = {
    accept: 'application/ld+json',
    'Content-type': method !== 'PATCH' ? 'application/json' : 'application/merge-patch+json'
  };

  const accessToken = session.get<string>('accessToken');
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (!req.url) {
    throw new Error('Request is required to have an url!');
  }

  const url = `${ENTRYPOINT}${req.url.replace(/^\/api\/proxy/, '')}`;

  try {
    const {status, data} = await axios.request({url, method: method as Method, headers, data: body});

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
