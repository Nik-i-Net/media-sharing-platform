import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User, UserUpdate } from './user.entity.js';
import type { UsersRepository } from './users.repository.js';
import { NotFoundError } from '@common/errors/http.errors.js';

// NOTE: move password hashing logic to a separate service
class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create({
      id: uuidv4(),
      username: dto.username,
      email: dto.email,
      passwordHash: await bcrypt.hash(dto.password, 10),
    });

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const { password, ...rest } = dto;
    const updates: UserUpdate = rest;
    if (password) {
      updates.passwordHash = await bcrypt.hash(password, 10);
    }

    // NOTE: since all props in UpdateUserDto and UserUpdate are optional,
    // it's possible to pass dto (with password instead of passwordHash)
    // to usersRepository.update(), which will cause an error
    // FIX: find an elegant solution without manually checking each property
    const updatedUser = await this.usersRepository.update(id, updates);
    if (!updatedUser) throw new NotFoundError('User not found');
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const count = await this.usersRepository.delete(id);
    if (!count) throw new NotFoundError('User not found');
  }
}

export { UsersService };
