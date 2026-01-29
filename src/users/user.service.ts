import { UserDto } from './dto/user.dto.js';
import { NotFoundException } from '@shared/domain/errors/not-found.exception.js';
import type { UserRepository } from './user.repository.js';
import type { UpdateUserDto } from './dto/_update-user.dto.js';
import type { Email, UserId, Username } from '@shared/application/primitives.dto.js';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: UserId): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User');
    return UserDto.parse(user);
  }

  async update(id: UserId, updates: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User');

    // TODO: *updates*
    console.log(updates);
    // *updates*

    await this.userRepository.save(user);
    return UserDto.parse(user);
  }

  async delete(id: UserId): Promise<void> {
    const isDeleted = await this.userRepository.delete(id);
    if (!isDeleted) throw new NotFoundException('User');
  }

  async isUsernameAvailable(username: Username): Promise<boolean> {
    return await this.userRepository.existsByUsername(username);
  }

  async isEmailAvailable(email: Email): Promise<boolean> {
    return await this.userRepository.existsByEmail(email);
  }
}

export { UserService };
