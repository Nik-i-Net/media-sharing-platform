import { MEMORY_UNITS } from '@common/constants';
import type { MediaPolicy } from '@features/media/media.service';

export const mediaPolicy: MediaPolicy = {
  allowedMimeTypes: [
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
  ],

  fileSizeLimits: {
    guest: 1 * MEMORY_UNITS.MiB,
    user: 5 * MEMORY_UNITS.MiB,
    // premium: 20 * MEMORY_UNITS.MiB,
  },
} as const;
