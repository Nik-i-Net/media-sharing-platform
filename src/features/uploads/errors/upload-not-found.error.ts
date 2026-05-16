import { NotFoundError } from '@/shared/errors';

export class UploadNotFoundError extends NotFoundError {
  constructor() {
    super('Upload not found', 'UPLOAD_NOT_FOUND');
  }
}
