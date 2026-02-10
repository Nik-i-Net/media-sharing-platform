import { StatusCodes } from 'http-status-codes';
import { ms } from '@core/utils/ms';
import { Token } from '../../application/dto';
import type { Duration } from '@core/types';
import type { AuthService } from '../../application/auth.service';
import type { ReqWithBody, Res, Req } from '../types';
import type { RegisterDto, AuthResponseDto, LoginDto, UpdatePasswordDto, UpdateEmailDto } from '../../application/dto';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: ReqWithBody<RegisterDto>, res: Res<AuthResponseDto>) => {
    const { dto, refreshToken, refreshTtl } = await this.authService.register(req.body);
    this.setRefreshTokenCookie(req, res, refreshToken, refreshTtl);
    res.status(StatusCodes.CREATED).json(dto);
  };

  login = async (req: ReqWithBody<LoginDto>, res: Res<AuthResponseDto>) => {
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

  updatePassword = async (req: ReqWithBody<UpdatePasswordDto>, res: Res) => {
    console.log(req.body);
    res.send('todo');
  };

  updateEmail = async (req: ReqWithBody<UpdateEmailDto>, res: Res) => {
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
