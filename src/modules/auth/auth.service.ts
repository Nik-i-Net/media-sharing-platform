import type { UsersService } from '../users/users.service.js';

class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(body: object): Promise<unknown> {
    console.log(body);
    return 'register';
  }

  async login(body: object): Promise<unknown> {
    console.log(body);
    return 'login';
  }

  async logout(body: object): Promise<unknown> {
    console.log(body);
    return 'logout';
  }
}

export { AuthService };
