import { ForbiddenError } from '@/shared/errors';
import type { AlbumsRepository } from '../domain/albums.repository';

export interface UpdateAlbumCommand {
  userId: string;
  albumId: string;
  name?: string;
  isPublic?: boolean;
}

export class UpdateAlbumCommandHandler {
  constructor(private readonly albumsRepo: AlbumsRepository) {}

  async execute(cmd: UpdateAlbumCommand): Promise<void> {
    const album = await this.albumsRepo.findById(cmd.albumId);
    if (!album || cmd.userId !== album.userId) throw new ForbiddenError();

    if (cmd.name) album.changeName(cmd.name);
    if (cmd.isPublic !== undefined) album.setPublic(cmd.isPublic);

    await this.albumsRepo.save(album);
  }
}
