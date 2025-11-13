import type { Req, Res } from '@src/shared/types/request.types.js';
import type { AuthService } from './auth.service.js';

class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Req, res: Res): Promise<void> => {
    const result = await this.authService.register(req.body);
    res.send(result);
  };

  login = async (req: Req, res: Res): Promise<void> => {
    const result = await this.authService.login(req.body);
    res.send(result);
  };

  logout = async (req: Req, res: Res): Promise<void> => {
    const result = await this.authService.logout(req.body);
    res.send(result);
  };
}

export { AuthController };
