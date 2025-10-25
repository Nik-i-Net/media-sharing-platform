import { StatusCodes } from 'http-status-codes';
import { usersService } from './users.service.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserInfoDto } from './dto/update-user-info.dto.js';
import type { User } from './entities/user.entity.js';
import type { Req, Res, ReqWithBody, IdParams } from '../../shared/types/request.types.js';

class UsersController {
  async createUser(req: ReqWithBody<CreateUserDto>, res: Res<User>): Promise<void> {
    try {
      const user = await usersService.createUser(req.body);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }

  async getUserById(req: Req<IdParams>, res: Res<User>): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await usersService.getUserById(id);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }

  async updateUserInfo(req: Req<IdParams, UpdateUserInfoDto>, res: Res<User>): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updatedUser = await usersService.updateUserInfo(id, req.body);
      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }

  async deleteUser(req: Req<IdParams>, res: Res<void>): Promise<void> {
    try {
      const id = Number(req.params.id);
      await usersService.deleteUser(id);
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  }
}

export const usersController = new UsersController();
