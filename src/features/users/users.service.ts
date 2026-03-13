import type { UsersRepository } from './users.repository';
import type { UserId, Username, Email } from '@common/schemas/primitives.dto';
import { TodoException } from '@common/errors';
import type { TODO } from '@common/types';

// TODO:
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getById(id: UserId): Promise<TODO> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new TodoException('User not found');
    return 'TODO';
  }

  async delete(id: UserId): Promise<void> {
    const isDeleted = await this.usersRepository.delete(id);
    if (!isDeleted) throw new TodoException('User not found');
  }

  async isUsernameAvailable(username: Username): Promise<boolean> {
    return await this.usersRepository.existsByUsername(username);
  }

  async isEmailAvailable(email: Email): Promise<boolean> {
    return await this.usersRepository.existsByEmail(email);
  }
}
