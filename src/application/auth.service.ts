import { InvalidCredentialsException, UserAlreadyExistsException, UserNotFoundException } from '../core/errors';
import { User } from '../domain/entities/user';
import { Email, Token } from './dto/primitives.dto';
import type { UserRepository } from '../domain/repositories/user.repository';
import type { HashService } from './ports/hash.service';
import type { TokenService } from './ports/token.service.ts';
import type { Duration } from '../core/types';
import { AuthResponse, type RegisterRequest, type LoginRequest, RefreshTokenPayload } from './dto';

export interface AuthPolicy {
  accessTokenExpiresIn: Duration;
  refreshTokenExpiresIn: Duration;
}

interface AuthResult {
  dto: AuthResponse;
  refreshToken: Token;
  refreshTtl: Duration;
}

interface RefreshResult {
  accessToken: Token;
  refreshToken: Token;
  refreshTtl: Duration;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly policy: AuthPolicy,
  ) {}

  async register(dto: RegisterRequest): Promise<AuthResult> {
    const [emailTaken, usernameTaken] = await Promise.all([
      this.userRepository.existsByEmail(dto.email),
      this.userRepository.existsByUsername(dto.username),
    ]);

    const conflicts = [];
    if (emailTaken) conflicts.push('email');
    if (usernameTaken) conflicts.push('username');
    if (conflicts.length) throw new UserAlreadyExistsException(conflicts);

    const id = crypto.randomUUID();
    const passwordHash = await this.hashService.hash(dto.password);
    const user = User.register(id, dto.username, dto.email, passwordHash);
    await this.userRepository.save(user);

    return this.generateAuthResult(user);
  }

  async login(dto: LoginRequest): Promise<AuthResult> {
    const isEmail = Email.safeParse(dto.identifier).success;
    const user = isEmail
      ? await this.userRepository.findByEmail(dto.identifier)
      : await this.userRepository.findByUsername(dto.identifier);

    if (!user) throw new InvalidCredentialsException();

    const validPassword = await this.hashService.verify(dto.password, user.passwordHash);
    if (!validPassword) throw new InvalidCredentialsException();

    return this.generateAuthResult(user);
  }

  async refresh(refreshToken: Token): Promise<RefreshResult> {
    const rawPayload = await this.tokenService.verify(refreshToken);
    const payload = RefreshTokenPayload.parse(rawPayload);
    const userId = payload.sub;
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    const tokens = await this.generateTokenPair(user.id);
    return { ...tokens, refreshTtl: this.policy.refreshTokenExpiresIn };
  }

  private async generateTokenPair(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.sign({ sub: userId }, this.policy.accessTokenExpiresIn),
      this.tokenService.sign({ sub: userId }, this.policy.refreshTokenExpiresIn),
    ]);

    return {
      accessToken: Token.parse(accessToken),
      refreshToken: Token.parse(refreshToken),
    };
  }

  private async generateAuthResult(user: User): Promise<AuthResult> {
    const { accessToken, refreshToken } = await this.generateTokenPair(user.id);

    return {
      dto: AuthResponse.parse({ user, accessToken }),
      refreshToken,
      refreshTtl: this.policy.refreshTokenExpiresIn,
    };
  }
}
