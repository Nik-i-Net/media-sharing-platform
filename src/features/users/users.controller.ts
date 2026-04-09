// // TODO: refactor
// import { usersController } from '../../di';
// import { StatusCodes } from 'http-status-codes';
// import { Router, type Request, type Response } from 'express';
// import type { UsersService } from './users.service';
//
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}
//
//   getProfile = async (req: Request, res: Response) => {
//     console.log(req.get('Authorization'));
//     res.end();
//   };
//
//   updateProfile = async (req: Request, res: Response) => {
//     res.end();
//   };
//
//   deleteAccount = async (req: Request, res: Response) => {
//     res.sendStatus(StatusCodes.NO_CONTENT);
//   };
// }
//
// export const usersRouter = Router();
// usersRouter
//   .route('/me') //
//   .get(usersController.getProfile)
//   .post(usersController.updateProfile)
//   .delete(usersController.deleteAccount);
//
//

import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '@shared/middlewares';
import type { ResolveUserUseCase } from './resolve-user.command';

const Auth0RequestSchema = z.object({
  sub: z.string().regex(/^(auth0|google-oauth2)\|\w+$/),
  email: z.email(),
  email_verified: z.boolean(),
});

export class UsersController {
  readonly router = Router();

  constructor(private readonly resolveUserUseCase: ResolveUserUseCase) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/auth0', validateRequest({ body: Auth0RequestSchema }), async (req, res) => {
      const [provider, providerUserId] = req.body.sub.split('|');
      const userId = await this.resolveUserUseCase.execute(provider!, providerUserId!);
      res.json({ userId });
    });
  }
}
