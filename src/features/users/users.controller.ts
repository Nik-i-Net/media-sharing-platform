// TODO: refactor
import { usersController } from '../../di';
import { StatusCodes } from 'http-status-codes';
import { Router, type Request, type Response } from 'express';
import type { UsersService } from './users.service';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  getProfile = async (req: Request, res: Response) => {
    console.log(req.get('Authorization'));
    res.end();
  };

  updateProfile = async (req: Request, res: Response) => {
    res.end();
  };

  deleteAccount = async (req: Request, res: Response) => {
    res.sendStatus(StatusCodes.NO_CONTENT);
  };
}

export const usersRouter = Router();
usersRouter
  .route('/me') //
  .get(usersController.getProfile)
  .post(usersController.updateProfile)
  .delete(usersController.deleteAccount);
