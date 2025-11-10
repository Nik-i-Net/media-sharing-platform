import { USER_NOT_FOUND } from '@src/shared/errors/users.errors.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserInfoDto } from './dto/update-user-info.dto.js';
import type { User } from './entities/user.entity.js';
import type { UsersRepository } from './users.repository.js';

class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(userInfo: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(userInfo);
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);
    return user;
  }

  async updateUserInfo(id: number, userInfo: UpdateUserInfoDto): Promise<User> {
    const updatedUser = await this.usersRepository.update(id, userInfo);
    if (!updatedUser) throw new Error(USER_NOT_FOUND);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const count = await this.usersRepository.delete(id);
    if (!count) throw new Error(USER_NOT_FOUND);
  }
}

export { UsersService };
