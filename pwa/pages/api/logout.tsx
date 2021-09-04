import { NextApiResponse } from 'next';
import withSession, { NextIronRequest } from 'utils/session';

export default withSession(async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    req.session.unset('tokens');
    req.session.save();

    res.status(200).json({});
  } catch (error) {
    if (error.response) {
      const {status, data} = error.response;
      return res.status(status).json(data);
    }

    res.status(500).json(error);
  }
});
