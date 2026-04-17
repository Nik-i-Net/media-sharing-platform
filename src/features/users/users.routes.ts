import { Router } from 'express';
import { checkApiKey, validateRequest } from '@shared/middlewares';
import { ENV } from '@config/env.loader';
import { Auth0RequestSchema } from './dto/auth0.request';
import { AuthCommand } from './use-cases/auth.command';
import { authCommandHandler } from '../../di';

export const usersRouter = Router();

usersRouter.post(
  '/auth0',
  checkApiKey(ENV.AUTH0_API_KEY),
  validateRequest({ body: Auth0RequestSchema }),
  async (req, res) => {
    const { provider, providerUserId, email, emailVerified } = req.body;
    const cmd = new AuthCommand(provider, providerUserId, email, emailVerified);
    const userId = await authCommandHandler.execute(cmd);
    res.json({ userId });
  },
);
