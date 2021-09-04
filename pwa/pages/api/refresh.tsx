import axios from 'axios';
import { NEXT_PUBLIC_ENTRYPOINT } from 'config/entrypoint';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {headers} = req;

  try {
    const {data, headers: returnedHeaders} = await axios.post(
      `${NEXT_PUBLIC_ENTRYPOINT}/auth/refresh`,
      undefined,
      {
        headers,
      },
    );

    Object.keys(returnedHeaders).forEach(key =>
      res.setHeader(key, returnedHeaders[key]),
    );

    res.status(200).json(data);
  } catch (error) {
    res.send(error);
  }
}
