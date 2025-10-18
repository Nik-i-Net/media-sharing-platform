import { usersService } from './users.service.js';
import { StatusCodes } from 'http-status-codes';

class UsersController {
  async createUser(req, res) {
    try {
      const userInfo = req.body;
      const user = await usersService.createUser(userInfo);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      console.log(error);
    }
  }

  async getUserById(req, res) {
    try {
      const id = Number(req.params.id);
      const user = await usersService.getUserById(id);
      res.json(user);
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserInfo(req, res) {
    try {
      const id = Number(req.params.id);
      const userInfo = req.body;
      const updatedUser = await usersService.updateUserInfo(id, userInfo);
      res.json(updatedUser);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser(req, res) {
    try {
      const id = Number(req.params.id);
      await usersService.deleteUser(id);
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      console.log(error);
    }
  }
}

export const usersController = new UsersController();
