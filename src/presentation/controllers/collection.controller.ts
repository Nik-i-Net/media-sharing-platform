import { Router } from 'express';
import type { CollectionService } from '../../application/collection.service';
import type { JwtAuthMiddleware } from '../middlewares/jwt-auth.middleware';
import { assertDefined } from '../../core/utils';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { CreateCollectionDtoSchema } from '../../application/dto';

export function createCollectionRouter(collectionService: CollectionService, jwtAuth: JwtAuthMiddleware) {
  const router = Router();

  router.post(
    '/', //
    jwtAuth(),
    validateRequest({ body: CreateCollectionDtoSchema }),
    async (req, res) => {
      assertDefined(req.user);
      const inputDto = {
        userId: req.user.id,
        collectionName: req.body.collectionName,
      };
      const collection = await collectionService.create(inputDto);
      res.status(201).json({ data: collection });
    },
  );

  router.get(
    '/', //
    jwtAuth(),
    async (req, res) => {
      assertDefined(req.user);
      const collections = await collectionService.listCollections(req.user.id);
      res.json({ data: collections });
    },
  );

  return router;
}
