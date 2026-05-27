import { ForbiddenError } from '@/shared/errors';
import type { UnitOfWork } from '@/shared/ports/unit-of-work';

export interface DeleteAlbumCommand {
  albumId: string;
  userId: string;
}

export class DeleteAlbumCommandHandler {
  constructor(private readonly uow: UnitOfWork) {}

  async execute(cmd: DeleteAlbumCommand): Promise<void> {
    await this.uow.execute(async (ctx) => {
      // NOTE: investigate is it safe to run multiple queries in the same transaction in parallel
      const [isDeleted] = await Promise.all([
        ctx.albumsRepository.delete(cmd.albumId),
        ctx.userCountersRepository.decrementTotalAlbums(cmd.userId, 1),
      ]);

      if (!isDeleted) throw new ForbiddenError();
    });
  }
}
