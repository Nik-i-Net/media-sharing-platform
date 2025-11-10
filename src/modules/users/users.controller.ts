import { StatusCodes } from 'http-status-codes';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserInfoDto } from './dto/update-user-info.dto.js';
import type { User } from './entities/user.entity.js';
import type { Req, Res, ReqWithBody, IdParams } from '../../shared/types/request.types.js';
import type { UsersService } from './users.service.js';
import { USER_NOT_FOUND } from '@src/shared/errors/users.errors.js';

class UsersController {
  constructor(private readonly usersService: UsersService) {}

  createUser = async (req: ReqWithBody<CreateUserDto>, res: Res<User>): Promise<void> => {
    try {
      const user = await this.usersService.createUser(req.body);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      console.log(error);
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  getUserById = async (req: Req<IdParams>, res: Res<User>): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const user = await this.usersService.getUserById(id);
      res.json(user);
    } catch (error) {
      console.log(error);

      if (error instanceof Error && error.message === USER_NOT_FOUND) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
      }

      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  updateUserInfo = async (req: Req<IdParams, UpdateUserInfoDto>, res: Res<User>): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const updatedUser = await this.usersService.updateUserInfo(id, req.body);
      res.json(updatedUser);
    } catch (error) {
      console.log(error);

      if (error instanceof Error && error.message === USER_NOT_FOUND) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
      }

      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  deleteUser = async (req: Req<IdParams>, res: Res<void>): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.usersService.deleteUser(id);
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      console.log(error);

      if (error instanceof Error && error.message === USER_NOT_FOUND) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
      }

      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}

export { UsersController };
