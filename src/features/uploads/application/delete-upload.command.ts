import { ForbiddenError } from '@/shared/errors';
import type { UnitOfWork } from '@/shared/ports/unit-of-work';
import assert from 'assert';

export interface DeleteUploadCommand {
  uploadId: string;
  userId: string;
}

export class DeleteUploadCommandHandler {
  constructor(private readonly uow: UnitOfWork) {}

  async execute(cmd: DeleteUploadCommand): Promise<void> {
    await this.uow.execute(async (ctx) => {
      const result = await ctx.uploadsRepository.delete(cmd.uploadId);
      if (!result.isDeleted) throw new ForbiddenError();

      const sizeBytes = await ctx.blobsRepository.findSizeById(result.blobId);
      assert(sizeBytes);

      await Promise.all([
        ctx.userCountersRepository.decrementTotalUploads(cmd.userId, 1),
        ctx.userCountersRepository.decrementTotalStorageBytes(cmd.userId, sizeBytes),
      ]);
    });
  }
}
