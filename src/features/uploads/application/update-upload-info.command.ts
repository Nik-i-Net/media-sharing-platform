import { UnauthorizedError } from '@/shared/errors';
import type { UploadsRepository } from '../domain/uploads.repository';
import { UploadNotFoundError } from '../errors/upload-not-found.error';

// TODO: expiresAt
export interface UpdateUploadInfoCommand {
  userId: string;
  uploadId: string;
  fileName?: string;
  isPublic?: boolean;
}

export class UpdateUploadInfoCommandHandler {
  constructor(private readonly uploadsRepo: UploadsRepository) {}

  async execute(cmd: UpdateUploadInfoCommand): Promise<void> {
    const upload = await this.uploadsRepo.findById(cmd.uploadId);
    if (!upload) throw new UploadNotFoundError();
    if (cmd.userId !== upload.userId) throw new UnauthorizedError();

    if (cmd.fileName) upload.changeFileName(cmd.fileName);
    if (cmd.isPublic !== undefined) upload.setPublic(cmd.isPublic);

    await this.uploadsRepo.save(upload);
  }
}
