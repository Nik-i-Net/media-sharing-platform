import type { UserRepository } from '../domain/repositories/user.repository.js';
import type { HashService } from './ports/hash.service.js';
import type { TokenService } from './ports/token.service.ts';
import { AuthResponseDto, Email, UserDto, type LoginDto, type RegisterDto } from './dto/index.js';
import { UserNotFoundException } from './exceptions/index.js';

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

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const errors = [];
    const [emailTaken, usernameTaken] = await Promise.all([
      this.userRepository.existsByEmail(dto.email),
      this.userRepository.existsByUsername(dto.username),
    ]);

    if (emailTaken) errors.push({ message: 'Email already taken', code: 'EMAIL_ALREADY_TAKEN' });
    if (usernameTaken) errors.push({ message: 'Username already taken', code: 'USERNAME_ALREADY_TAKEN' });

    // if (errors.length) throw new Con
    return {} as AuthResponseDto;
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const isEmail = Email.safeParse(dto.identifier).success;
    const user = isEmail
      ? await this.userRepository.findByEmail(dto.identifier)
      : await this.userRepository.findByUsername(dto.identifier);

    if (!user) throw new UserNotFoundException();

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
