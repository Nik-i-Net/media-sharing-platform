import { StatusCodes } from 'http-status-codes';
import type { Req, Res } from '../types';

class MediaController {
  constructor() {}

  webhook = async (req: Req, res: Res) => {
    console.log(req.body);
    res.sendStatus(StatusCodes.NO_CONTENT);
  };
}

export { MediaController };
