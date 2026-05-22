import { UnauthorizedError } from '@/shared/errors';
import type { AlbumsRepository } from '../domain/albums.repository';
import { AlbumNotFoundError } from '../errors/album-not-found.error';

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
    if (!album) throw new AlbumNotFoundError();
    if (cmd.userId !== album.userId) throw new UnauthorizedError();

    if (cmd.name) album.changeName(cmd.name);
    if (cmd.isPublic !== undefined) album.setPublic(cmd.isPublic);

    await this.albumsRepo.save(album);
  }
}
