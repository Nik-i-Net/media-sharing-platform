import { z } from 'zod';

export const MimeTypeSchema = z
  .string()
  .regex(/^(image|audio|video)\/[a-zA-Z0-9\-+]+$/)
  .meta({ example: 'image/png' });

export const Sha256Base64Schema = z
  .hash('sha256', {
    enc: 'base64',
    error: 'Invalid hash, should be sha256 base64 string',
  })
  .brand<'Sha256Base64'>()
  .meta({ example: 'ABCDeFg6UgoA5KmX6T4Xq4hupaIIt9KQh/ZDKvNyroE=' });
export type Sha256Base64 = z.infer<typeof Sha256Base64Schema>;
