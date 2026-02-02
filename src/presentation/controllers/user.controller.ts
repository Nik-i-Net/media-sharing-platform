import { StatusCodes } from 'http-status-codes';
import type { UserService } from 'src/application/user.service.js';
import type { Req, Res } from '../express.types.js';
import type { UserDto } from 'src/application/dto/user.dto.js';

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
