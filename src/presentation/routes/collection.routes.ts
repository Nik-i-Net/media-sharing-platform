import { Router, type NextFunction, type Request, type RequestHandler } from 'express';
import type { CollectionService } from '../../application/collection.service';
import { jwtAuth } from '../../composition-root';
// import { mediaController } from '../../composition-root';
//
// const mediaRouter = Router();
//
// mediaRouter.get('/:id', mediaController.getDownloadUrl);
// mediaRouter.post('/uploads', mediaController.initiateUploads);
// mediaRouter.post('/uploads/confirm', mediaController.confirmUploads);
//
// export { mediaRouter };

class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  create = async (req: AuthedReqWithBody<CreateCollectionRequest>, res: Res<CollectionResponse>) => {
    const collection = await this.collectionService.create(req.user.id, req.body);
    res.status(StatusCodes.CREATED).json({ data: collection });
  };

  // TODO: Query validation
  getUserCollections = async (
    req: AuthedReqWithQuery<{ page: number; limit: number }>,
    res: Res<CollectionSummaryResponse[]>,
  ) => {
    const collections = await this.collectionService.listCollections(req.user.id);
    res.json({ data: collections });
  };
}

type AuthedRequest<Params = unknown, ResBody = unknown, ReqBody = unknown, Query = unknown> = Request<
  Params,
  ResBody,
  ReqBody,
  Query
> & {
  user: { name: string };
};

function validateBody<Params, ResBody, ReqBody, Query>(body: any): RequestHandler<Params, ResBody, ReqBody, Query> {
  return (req: Request<Params, ResBody, ReqBody, Query>, _res, next: NextFunction) => {
    req.body = body;
    next();
  };
}

export function createCollectionRoutes(collectionService: CollectionService) {
  const collectionRouter = Router();

  collectionRouter.post(
    '/:id', //
    (req, res, next) => {
      req.body.id = 5;
      next();
    },
    (req, res) => {
      req.body.id;
    },
  );

  collectionRouter.get('/user', collectionController.getUserCollections);

  return collectionRouter;
}
