import { MEMORY_UNITS } from '@core/constants';

export const mediaPolicy = {
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

  maxFileSizes: {
    guest: 1 * MEMORY_UNITS.MiB,
    user: 5 * MEMORY_UNITS.MiB,
    // premium: 20 * MEMORY_UNITS.MiB,
  },
};
