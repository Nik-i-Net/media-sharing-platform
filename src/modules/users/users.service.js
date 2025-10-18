import { usersRepository } from './users.repository.js';

class UsersService {
  async createUser(userInfo) {
    const user = await usersRepository.create(userInfo);
    return user;
  }

  async getUserById(id) {
    const user = await usersRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUserInfo(id, userInfo) {
    const updatedUser = await usersRepository.update(id, userInfo);
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  }

  async deleteUser(id) {
    const count = await usersRepository.delete(id);
    if (!count) throw new Error('User not found');
  }
}

export const usersService = new UsersService();
