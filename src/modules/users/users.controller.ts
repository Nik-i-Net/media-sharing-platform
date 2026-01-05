import { StatusCodes } from 'http-status-codes';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user-info.dto.js';
import type { User } from './entities/user.entity.js';
import type { Req, Res, ReqWithBody, IdParams } from '../../shared/types/request.types.js';
import type { UsersService } from './users.service.js';

class UsersController {
  constructor(private readonly usersService: UsersService) { }

  createUser = async (req: ReqWithBody<CreateUserDto>, res: Res<User>) => {
    const user = await this.usersService.createUser(req.body);
    res.status(StatusCodes.CREATED).json(user);
  };

  getUserById = async (req: Req<IdParams>, res: Res<User>) => {
    const user = await this.usersService.getUserById(req.params.id);
    res.json(user);
  };

  updateUserInfo = async (req: Req<IdParams, UpdateUserDto>, res: Res<User>) => {
    const updatedUser = await this.usersService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  };

  deleteUser = async (req: Req<IdParams>, res: Res<void>) => {
    await this.usersService.deleteUser(req.params.id);
    res.sendStatus(StatusCodes.NO_CONTENT);
  };
}

export { UsersController };
