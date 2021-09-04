import axios from 'axios';
import { NEXT_PUBLIC_ENTRYPOINT } from 'config/entrypoint';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {headers, body} = req;

  try {
    const {data, headers: returnedHeaders} = await axios.post(
      `${NEXT_PUBLIC_ENTRYPOINT}/auth/login`,
      body,
      {headers}
    );

    Object.entries(returnedHeaders).forEach((keyArr) =>
      res.setHeader(keyArr[0], keyArr[1] as string)
    );
    res.send(data);
  } catch ({response: {status, data}}) {
    res.status(status).json(data);
  }
}
