import { UserNotFoundException } from '@core/errors';
import type { UserRepository } from '../domain/repositories/user.repository';
import { UserResponse, type UserId, type Username, type Email } from './dto';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: UserId): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException();
    return UserResponse.parse(user);
  }

  async delete(id: UserId): Promise<void> {
    const isDeleted = await this.userRepository.delete(id);
    if (!isDeleted) throw new UserNotFoundException();
  }

  async isUsernameAvailable(username: Username): Promise<boolean> {
    return await this.userRepository.existsByUsername(username);
  }

  async isEmailAvailable(email: Email): Promise<boolean> {
    return await this.userRepository.existsByEmail(email);
  }
}

export { UserService };
