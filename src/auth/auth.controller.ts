import type { ReqWithBody, Res } from '@shared/infrastructure/web/express.types.js';
import type { AuthService } from './services/auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AccessTokenDto, RefreshTokenDto } from './dto/tokens.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { StatusCodes } from 'http-status-codes';
import type { UpdateEmailDto } from './dto/update-email.dto.js';

class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: ReqWithBody<RegisterDto>, res: Res<AuthResponseDto>) => {
    res.send();
  };

  login = async (req: ReqWithBody<LoginDto>, res: Res<AuthResponseDto>) => {
    res.send();
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
