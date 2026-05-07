import { MEMORY_UNITS } from '@/shared/constants';
import { TodoError } from '@/shared/errors';

type UserPlan = 'guest' | 'free' | 'premium';
type FileMetadata = { mimeType: string; size: number };

export class UploadPolicy {
  ensureIsAllowed(userPlan: UserPlan, fileMetadata: FileMetadata) {
    const { maxFileSize, allowedMimeTypes } = policies[userPlan];
    if (fileMetadata.size > maxFileSize) {
      throw new TodoError('File size is too large');
    }

    if (!allowedMimeTypes.includes(fileMetadata.mimeType)) {
      throw new TodoError('File type is not allowed');
    }
  }
}

// TODO: move to db
const supportedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',

  'audio/mpeg',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
  'audio/wav',
  'audio/ogg',
  'audio/webm',

  'video/mp4',
  'video/webm',
];

const policies: Record<UserPlan, { maxFileSize: number; allowedMimeTypes: string[] }> = {
  guest: {
    maxFileSize: 1 * MEMORY_UNITS.MiB,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  },
  free: {
    maxFileSize: 5 * MEMORY_UNITS.MiB,
    allowedMimeTypes: supportedMimeTypes,
  },
  premium: {
    maxFileSize: 20 * MEMORY_UNITS.MiB,
    allowedMimeTypes: supportedMimeTypes,
  },
};
