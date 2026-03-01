import { StatusCodes } from 'http-status-codes';
import type { Req, Res } from '../types';
import type { MediaService } from '../../application/media.service';

class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  getDownloadUrl = async (req: Req, res: Res) => {
    const url = await this.mediaService.getDownloadUrl();
    res.status(StatusCodes.OK).json({ url });
  };

  initiateUploads = async (req: Req, res: Res) => {
    const url = await this.mediaService.initiateUploads();
    res.status(StatusCodes.OK).json({ url });
  };

  confirmUploads = async (req: Req, res: Res) => {
    console.log(req.body);
    res.status(StatusCodes.OK).json({ message: 'Media uploads-confirm' });
  };
}

export { MediaController };
