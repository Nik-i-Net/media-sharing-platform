import { Album } from '../domain/album';
import type { AlbumsRepository } from '../domain/albums.repository';

export interface CreateAlbumCommand {
  userId: string;
  name: string;
  isPublic: boolean;
}

export class CreateAlbumCommandHandler {
  constructor(private readonly albumsRepo: AlbumsRepository) {}

  async execute(cmd: CreateAlbumCommand): Promise<string> {
    const album = Album.create({
      id: crypto.randomUUID(),
      userId: cmd.userId,
      name: cmd.name,
      isPublic: cmd.isPublic,
    });

    await this.albumsRepo.save(album);
    return album.id;
  }
}
