import { StatusCodes } from 'http-status-codes';
import { ms } from '@core/utils/ms';
import { Token } from '../../application/dto';
import type { Duration } from '@core/types';
import type { AuthService } from '../../application/auth.service';
import type { ReqWithBody, Res, Req } from '../types';
import type {
  RegisterRequest,
  AuthResponse,
  LoginRequest,
  UpdatePasswordRequest,
  UpdateEmailRequest,
} from '../../application/dto';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: ReqWithBody<RegisterRequest>, res: Res<AuthResponse>) => {
    const { dto, refreshToken, refreshTtl } = await this.authService.register(req.body);
    this.setRefreshTokenCookie(req, res, refreshToken, refreshTtl);
    res.status(StatusCodes.CREATED).json(dto);
  };

  login = async (req: ReqWithBody<LoginRequest>, res: Res<AuthResponse>) => {
    const { dto, refreshToken, refreshTtl } = await this.authService.login(req.body);
    this.setRefreshTokenCookie(req, res, refreshToken, refreshTtl);
    res.json(dto);
  };

  refresh = async (req: Req, res: Res) => {
    const token = Token.parse(req.cookies.refreshToken);
    const { accessToken, refreshToken, refreshTtl } = await this.authService.refresh(token);
    this.setRefreshTokenCookie(req, res, refreshToken, refreshTtl);
    res.json({ accessToken });
  };

  updatePassword = async (req: ReqWithBody<UpdatePasswordRequest>, res: Res) => {
    console.log(req.body);
    res.send('todo');
  };

  updateEmail = async (req: ReqWithBody<UpdateEmailRequest>, res: Res) => {
    console.log(req.body);
    res.send('todo');
  };

  private setRefreshTokenCookie(req: Req, res: Res, token: Token, ttl: Duration) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      // secure: true, // NOTE: requires https
      sameSite: 'strict',
      path: req.baseUrl + '/refresh',
      maxAge: ms(ttl),
    });
  }
}
