import { UserNotFoundError } from '@src/shared/errors/not-found.error.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user-info.dto.js';
import type { User } from './entities/user.entity.js';
import type { UsersRepository } from './users.repository.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async createUser(userInfo: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create({
      id: uuidv4(),
      username: userInfo.username,
      email: userInfo.email,
      passwordHash: await bcrypt.hash(userInfo.password, 10),
    });

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new UserNotFoundError();
    return user;
  }

  async updateUser(id: string, userInfo: UpdateUserDto): Promise<User> {
    const updatedUser = await this.usersRepository.update(id, userInfo);
    if (!updatedUser) throw new UserNotFoundError();
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const count = await this.usersRepository.delete(id);
    if (!count) throw new UserNotFoundError();
  }
}

export { UsersService };
