import { ForbiddenError } from '@/shared/errors';

export class AlbumAccessDeniedError extends ForbiddenError {
  constructor(userId: string, albumId: string) {
    super(`User ${userId} does not have access to album ${albumId}`, 'ALBUM_ACCESS_DENIED');
  }
}
