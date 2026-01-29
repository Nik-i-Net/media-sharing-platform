import { StatusCodes } from 'http-status-codes';
import type { Req, ReqWithBody, Res } from '@shared/infrastructure/web/express.types.js';
import type { UserService } from './user.service.js';
import { UserDto } from './dto/user.dto.js';
import type { UpdateUserDto } from './dto/_update-user.dto.js';

// FIX: replace with req.user.id after adding a middleware to parse jwt tokens
import { userId } from '@shared/application/primitives.dto.js';
const _userId = userId.parse('2beaacde-99a9-44bd-a1f0-5f6d2f5ae5eb');

class UserController {
  constructor(private readonly userService: UserService) {}

  getMe = async (req: Req, res: Res<UserDto>) => {
    const userDto = await this.userService.getById(_userId);
    res.json(userDto);
  };

  updateMe = async (req: ReqWithBody<UpdateUserDto>, res: Res<UserDto>) => {
    const updatedUser = await this.userService.update(_userId, req.body);
    res.json(UserDto.parse(updatedUser));
  };

  deleteMe = async (req: Req, res: Res<void>) => {
    await this.userService.delete(_userId);
    res.sendStatus(StatusCodes.NO_CONTENT);
  };
}

export { UserController };
