import { Router } from 'express';
import { mediaController } from '../../composition-root';

const mediaRouter = Router();

mediaRouter.get('/:id', mediaController.getDownloadUrl);
mediaRouter.post('/uploads', mediaController.initiateUploads);
mediaRouter.post('/uploads/confirm', mediaController.confirmUploads);

export { mediaRouter };
