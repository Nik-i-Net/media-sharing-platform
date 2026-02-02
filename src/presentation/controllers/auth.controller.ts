import type { ReqWithBody, Res } from '../express.types.js';
import type { AuthService } from '../../application/auth.service.js';
import { StatusCodes } from 'http-status-codes';
import {
  type RegisterDto,
  type LoginDto,
  type RefreshTokenDto,
  type UpdatePasswordDto,
  type UpdateEmailDto,
  AuthResponseDto,
  AccessTokenDto,
} from '../../application/dto/index.js';

class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: ReqWithBody<RegisterDto>, res: Res<AuthResponseDto>) => {
    res.send();
  };

  login = async (req: ReqWithBody<LoginDto>, res: Res<AuthResponseDto>) => {
    const response = await this.authService.login(req.body);
    res.json(response);
  };

  refresh = async (req: ReqWithBody<RefreshTokenDto>, res: Res<AccessTokenDto>) => {
    res.send();
  };

  updatePassword = async (req: ReqWithBody<UpdatePasswordDto>, res: Res<void>) => {
    res.sendStatus(StatusCodes.NO_CONTENT);
  };

  updateEmail = async (req: ReqWithBody<UpdateEmailDto>, res: Res<void>) => {
    res.sendStatus(StatusCodes.NO_CONTENT);
  };
}

export { AuthController };
