import type { AlbumsRepository } from '../domain/albums.repository';
import { AlbumNotFoundError } from '../errors/album-not-found.error';

export interface DeleteAlbumCommand {
  id: string;
  userId: string;
}

export class DeleteAlbumCommandHandler {
  constructor(private readonly albumsRepo: AlbumsRepository) {}

  async execute(cmd: DeleteAlbumCommand): Promise<void> {
    const isDeleted = await this.albumsRepo.delete(cmd.id);
    if (!isDeleted) throw new AlbumNotFoundError();
  }
}
