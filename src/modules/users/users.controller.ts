import { StatusCodes } from 'http-status-codes';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserInfoDto } from './dto/update-user-info.dto.js';
import type { User } from './entities/user.entity.js';
import type { Req, Res, ReqWithBody, IdParams } from '../../shared/types/request.types.js';
import type { UsersService } from './users.service.js';

class UsersController {
  constructor(private usersService: UsersService) {}

  createUser = async (req: ReqWithBody<CreateUserDto>, res: Res<User>): Promise<void> => {
    try {
      const user = await this.usersService.createUser(req.body);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  };

  getUserById = async (req: Req<IdParams>, res: Res<User>): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const user = await this.usersService.getUserById(id);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  };

  updateUserInfo = async (req: Req<IdParams, UpdateUserInfoDto>, res: Res<User>): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const updatedUser = await this.usersService.updateUserInfo(id, req.body);
      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  };

  deleteUser = async (req: Req<IdParams>, res: Res<void>): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.usersService.deleteUser(id);
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  };
}

export { UsersController };
