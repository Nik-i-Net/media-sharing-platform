import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserInfoDto } from './dto/update-user-info.dto.js';
import type { User } from './entities/user.entity.js';
import type { UsersRepository } from './users.repository.js';

class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(userInfo: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(userInfo);
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUserInfo(id: number, userInfo: UpdateUserInfoDto): Promise<User> {
    const updatedUser = await this.usersRepository.update(id, userInfo);
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const count = await this.usersRepository.delete(id);
    if (!count) throw new Error('User not found');
  }
}

export { UsersService };
