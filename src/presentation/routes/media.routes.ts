import { Router } from 'express';
import { mediaController } from '../../composition-root';

const mediaRouter = Router();

mediaRouter.post(
  '/webhook', //
  mediaController.webhook,
);

export { mediaRouter };
