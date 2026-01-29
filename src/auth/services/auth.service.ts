import type { RegisterDto } from '../dto/register.dto.js';
import type { UserRepository } from 'src/users/user.repository.js';
import type { TokenService } from './token.service.ts';
import type { HashService } from './hash.service.js';

export interface AuthPolicy {
  accessTokenExpiresIn: string | number;
  refreshTokenExpiresIn: string | number;
}

class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly policy: AuthPolicy,
  ) {}

  async register(dto: RegisterDto): Promise<unknown> {
    console.log(dto);
    return;
    // if (dto.password !== dto.passwordConfirm) {
    //   throw new BadRequestError('Passwords do not match');
    // }
    //
    // const existingUser = await this.userService;
  }

  async login(body: object): Promise<unknown> {
    console.log(body);
    return 'login';
  }

  async logout(body: object): Promise<unknown> {
    console.log(body);
    return 'logout';
  }

  async refresh(body: object): Promise<unknown> {
    console.log(body);
    return 'refresh';
  }
}

export { AuthService };
