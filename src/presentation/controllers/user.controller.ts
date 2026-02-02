import { StatusCodes } from 'http-status-codes';
import type { Req, Res } from '../express.types';
import type { UserService } from '../../application/user.service';
import type { UserDto } from '../../application/dto';

class UserController {
  constructor(private readonly userService: UserService) {}

  getMe = async (req: Req, res: Res<UserDto>) => {
    res.end();
  };

  updateMe = async (req: Req, res: Res) => {
    res.end();
  };

  deleteMe = async (req: Req, res: Res<void>) => {
    res.sendStatus(StatusCodes.NO_CONTENT);
  };
}

export { UserController };
