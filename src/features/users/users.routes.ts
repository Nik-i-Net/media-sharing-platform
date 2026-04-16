import { Router } from 'express';
import { checkApiKey, validateRequest } from '@shared/middlewares';
import { ENV } from '@config/env.loader';
import { AuthRequestSchema } from './dto/auth.request';
import { AuthCommand } from './use-cases/auth.command';
import { authCommandHandler } from '../../di';
import { ensureDefined } from '@shared/utils';

export const usersRouter = Router();

usersRouter.post(
  '/auth0',
  checkApiKey(ENV.AUTH0_API_KEY),
  validateRequest({ body: AuthRequestSchema }),
  async (req, res) => {
    const [provider, providerUserId] = req.body.sub.split('|');
    const cmd = new AuthCommand(
      ensureDefined(provider),
      ensureDefined(providerUserId),
      req.body.email?.value,
      req.body.email?.verified,
    );

    const userId = await authCommandHandler.execute(cmd);
    res.json({ userId });
  },
);
