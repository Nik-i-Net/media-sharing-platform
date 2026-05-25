import { ForbiddenError } from '@/shared/errors';
import type { UploadsRepository } from '../domain/uploads.repository';

export interface DeleteUploadCommand {
  uploadId: string;
  userId: string;
}

export class DeleteUploadCommandHandler {
  constructor(private readonly uploadsRepo: UploadsRepository) {}

  async execute(cmd: DeleteUploadCommand): Promise<void> {
    const isDeleted = await this.uploadsRepo.delete(cmd.uploadId);
    if (!isDeleted) throw new ForbiddenError();
  }
}
