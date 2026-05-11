import { NotFoundError } from '@/shared/errors';

export class AlbumNotFoundError extends NotFoundError {
  constructor() {
    super('Album not found', 'ALBUM_NOT_FOUND');
  }
}
