import type { UploadsRepository } from '@/features/uploads/domain/uploads.repository';
import { UploadsAccessDeniedError } from '@/features/uploads/errors/uploads-access-denied.error';
import type { AlbumsRepository } from '../domain/albums.repository';
import { AlbumAccessDeniedError } from '../errors/album-access-denied.error';

export interface LinkUploadsToAlbumCommand {
  userId: string;
  albumId: string;
  uploadIds: string[];
}

export class LinkUploadsToAlbumCommandHandler {
  constructor(
    private readonly albumsRepo: AlbumsRepository,
    private readonly uploadsRepo: UploadsRepository,
  ) {}
  async execute({ userId, albumId, uploadIds }: LinkUploadsToAlbumCommand): Promise<void> {
    const isAlbumOwner = await this.albumsRepo.isOwner(userId, albumId);
    if (!isAlbumOwner) throw new AlbumAccessDeniedError(userId, albumId);

    const imageOwnershipData = await this.uploadsRepo.findOwnershipData(uploadIds);
    const imageOwnershipMap = new Map(imageOwnershipData.map((d) => [d.uploadId, d.userId]));
    const unauthorizedIds: string[] = [];

    for (const id of uploadIds) {
      if (imageOwnershipMap.get(id) !== userId) {
        unauthorizedIds.push(id);
      }
    }

    if (unauthorizedIds.length > 0) {
      throw new UploadsAccessDeniedError(userId, unauthorizedIds);
    }

    await this.albumsRepo.linkUploads(albumId, uploadIds);
  }
}
