import type { AlbumsRepository } from '../domain/albums.repository';
import { AlbumAccessDeniedError } from '../errors/album-access-denied.error';

export interface UnlinkUploadsFromAlbumCommand {
  userId: string;
  albumId: string;
  uploadIds: string[];
}

export class UnlinkUploadsFromAlbumCommandHandler {
  constructor(private readonly albumsRepo: AlbumsRepository) {}

  async execute({ userId, albumId, uploadIds }: UnlinkUploadsFromAlbumCommand): Promise<void> {
    const isAlbumOwner = await this.albumsRepo.isOwner(userId, albumId);
    if (!isAlbumOwner) throw new AlbumAccessDeniedError(userId, albumId);

    await this.albumsRepo.unlinkUploads(albumId, uploadIds);
  }
}
