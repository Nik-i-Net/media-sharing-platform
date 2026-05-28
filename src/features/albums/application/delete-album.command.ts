import type { UnitOfWork } from '@/shared/ports/unit-of-work';
import { AlbumAccessDeniedError } from '../errors/album-access-denied.error';

export interface DeleteAlbumCommand {
  albumId: string;
  userId: string;
}

export class DeleteAlbumCommandHandler {
  constructor(private readonly uow: UnitOfWork) {}

  async execute(cmd: DeleteAlbumCommand): Promise<void> {
    await this.uow.execute(async (ctx) => {
      const isDeleted = await ctx.albumsRepository.delete(cmd.albumId);
      if (!isDeleted) throw new AlbumAccessDeniedError(cmd.userId, cmd.albumId);

      await ctx.userCountersRepository.decrementTotalAlbums(cmd.userId, 1);
    });
  }
}
