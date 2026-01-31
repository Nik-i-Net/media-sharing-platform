import type { RegisterDto } from '../dto/register.dto.js';
import type { UserRepository } from 'src/users/user.repository.js';
import type { TokenService } from './token.service.ts';
import type { HashService } from './hash.service.js';
import { User } from 'src/users/domain/user.js';
import { UserDto } from 'src/users/dto/user.dto.js';
import { AuthResponseDto } from '../dto/auth-response.dto.js';

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

  async login(): Promise<AuthResponseDto> {
    const user = User.register(crypto.randomUUID(), 'Alex', 'alex@mail.com', '');
    const userDto = UserDto.parse(user);
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.sign(userDto, this.policy.accessTokenExpiresIn),
      this.tokenService.sign(userDto, this.policy.refreshTokenExpiresIn),
    ]);
    return AuthResponseDto.parse({ user, accessToken, refreshToken });
  }

  async logout(): Promise<unknown> {
    return 'logout';
  }

  async refresh(): Promise<unknown> {
    return 'refresh';
  }
}

export { AuthService };
