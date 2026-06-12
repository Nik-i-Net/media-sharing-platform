import { TodoError } from '@/shared/errors';

export class Plan {
  constructor(
    readonly allowedMimeTypes: string[],
    readonly maxFileSizeBytes: number,
    readonly maxTotalStorageBytes: number,
  ) {}

  ensureCanUpload(
    files: Array<{ id: string; mimeType: string; sizeBytes: number }>,
    currentTotalStorageBytes: number,
  ) {
    let totalUsage = currentTotalStorageBytes;

    for (const file of files) {
      if (!this.allowedMimeTypes.includes(file.mimeType)) {
        throw new TodoError('Invalid mime type', 'INVALID_MIME_TYPE', {
          allowed: this.allowedMimeTypes,
          actual: file.mimeType,
        });
      }

      if (file.sizeBytes > this.maxFileSizeBytes) {
        throw new TodoError('File too large', 'FILE_TOO_LARGE', {
          max: this.maxFileSizeBytes,
          actual: file.sizeBytes,
        });
      }

      if (totalUsage + file.sizeBytes > this.maxTotalStorageBytes) {
        throw new TodoError('Storage quota exceeded', 'STORAGE_QUOTA_EXCEEDED');
      }

      totalUsage += file.sizeBytes;
    }
  }
}
