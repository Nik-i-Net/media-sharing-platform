import { ForbiddenError } from '@/shared/errors';
import type { AlbumsRepository } from '../domain/albums.repository';

export interface DeleteAlbumCommand {
  albumId: string;
  userId: string;
}

export class DeleteAlbumCommandHandler {
  constructor(private readonly albumsRepo: AlbumsRepository) {}

  async execute(cmd: DeleteAlbumCommand): Promise<void> {
    const isDeleted = await this.albumsRepo.delete(cmd.albumId);
    if (!isDeleted) throw new ForbiddenError();
  }
}
