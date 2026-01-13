import { StatusCodes } from 'http-status-codes';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { Req, Res } from '../../common/types/express.types.js';
import type { UsersService } from './users.service.js';
import { type PublicUser, toPublicUser } from './dto/public-user.js';

class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // NOTE: Auth module's responsibility
  // createUser = async (req: ReqWithBody<CreateUserDto>, res: Res<UserDto>) => {
  //   const user = await this.usersService.createUser(req.body);
  //   res.status(StatusCodes.CREATED).json(user);
  // };

  getUserById = async (req: Req<{ id: string }>, res: Res<PublicUser>) => {
    const user = await this.usersService.getUserById(req.params.id);
    res.json(toPublicUser(user));
  };

  updateUser = async (req: Req<{ id: string }, UpdateUserDto>, res: Res<PublicUser>) => {
    const updatedUser = await this.usersService.updateUser(req.params.id, req.body);
    res.json(toPublicUser(updatedUser));
  };

  deleteUser = async (req: Req<{ id: string }>, res: Res<void>) => {
    await this.usersService.deleteUser(req.params.id);
    res.sendStatus(StatusCodes.NO_CONTENT);
  };
}

export { UsersController };
