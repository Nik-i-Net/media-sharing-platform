import { StatusCodes } from 'http-status-codes';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserInfoDto } from './dto/update-user-info.dto.js';
import type { User } from './entities/user.entity.js';
import type { Req, Res, ReqWithBody, IdParams } from '../../shared/types/request.types.js';
import type { UsersService } from './users.service.js';

class UsersController {
  constructor(private readonly usersService: UsersService) {}

  createUser = async (req: ReqWithBody<CreateUserDto>, res: Res<User>) => {
    const user = await this.usersService.createUser(req.body);
    res.status(StatusCodes.CREATED).json(user);
  };

  getUserById = async (req: Req<IdParams>, res: Res<User>) => {
    const id = Number(req.params.id);
    const user = await this.usersService.getUserById(id);
    res.json(user);
  };

  updateUserInfo = async (req: Req<IdParams, UpdateUserInfoDto>, res: Res<User>) => {
    const id = Number(req.params.id);
    const updatedUser = await this.usersService.updateUserInfo(id, req.body);
    res.json(updatedUser);
  };

  deleteUser = async (req: Req<IdParams>, res: Res<void>) => {
    const id = Number(req.params.id);
    await this.usersService.deleteUser(id);
    res.sendStatus(StatusCodes.NO_CONTENT);
  };
}

export { UsersController };
