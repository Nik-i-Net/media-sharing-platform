// import { Router } from 'express';
// import { assertDefined } from '../../common/utils';
// import { type JwtAuthMiddleware, validateRequest } from '@core/middlewares';
// import type { CollectionService } from './collection.service';
// import { CreateCollectionDtoSchema } from './dto/create-collection.dto';
//
// export function createCollectionRouter(collectionService: CollectionService, jwtAuth: JwtAuthMiddleware) {
//   const router = Router();
//
//   router.post(
//     '/', //
//     jwtAuth(),
//     validateRequest({ body: CreateCollectionDtoSchema }),
//     async (req, res) => {
//       assertDefined(req.user);
//       const inputDto = {
//         userId: req.user.id,
//         collectionName: req.body.collectionName,
//       };
//       const collection = await collectionService.create(inputDto);
//       res.status(201).json({ data: collection });
//     },
//   );
//
//   // router.get(
//   //   '/', //
//   //   jwtAuth(),
//   //   async (req, res) => {
//   //     assertDefined(req.user);
//   //     const query:
//   //     const collections = await collectionService.list(req.user.id);
//   //     res.json({ data: collections });
//   //   },
//   // );
//
//   return router;
// }
