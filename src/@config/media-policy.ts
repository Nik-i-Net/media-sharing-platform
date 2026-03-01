import { MiB, MIME_TYPES } from '@core/constants';

export const mediaPolicy = {
  allowedMimeTypes: [
    // Images
    MIME_TYPES.PNG,
    MIME_TYPES.JPEG,
    MIME_TYPES.GIF,
    MIME_TYPES.WEBP,
    MIME_TYPES.SVG,
    MIME_TYPES.AVIF,

    // Audio
    MIME_TYPES.MPEG,
    MIME_TYPES.WAV,
    MIME_TYPES.OGG_AUDIO,
    MIME_TYPES.WEBM_AUDIO,

    // Video
    MIME_TYPES.MP4,
    MIME_TYPES.WEBM_VIDEO,
  ],

  maxFileSizes: {
    guest: 1 * MiB,
    user: 5 * MiB,
    // premium: 20 * MiB,
  },
};
