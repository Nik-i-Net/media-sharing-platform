import type { UsersRepository } from './users.repository';

export class ResolveUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(provider: string, providerUserId: string) {
    console.log(provider, providerUserId);
    return 'userId123';
  }
}
