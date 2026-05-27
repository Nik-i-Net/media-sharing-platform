import type { UnitOfWork } from '@/shared/ports/unit-of-work';
import { Album } from '../domain/album';

export interface CreateAlbumCommand {
  userId: string;
  name: string;
  isPublic: boolean;
}

export class CreateAlbumCommandHandler {
  constructor(private readonly uow: UnitOfWork) {}

  async execute(cmd: CreateAlbumCommand): Promise<string> {
    const album = Album.create({
      id: crypto.randomUUID(),
      userId: cmd.userId,
      name: cmd.name,
      isPublic: cmd.isPublic,
    });

    await this.uow.execute(async (ctx) => {
      await Promise.all([
        ctx.albumsRepository.save(album),
        ctx.userCountersRepository.incrementTotalAlbums(cmd.userId, 1),
      ]);
    });

    return album.id;
  }
}
