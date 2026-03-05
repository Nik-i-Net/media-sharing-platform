import { mediaPolicy } from '@config/media.policy';
import { z } from 'zod';

// Users + Auth
export const UserId = z.uuidv4('Invalid UUID').brand<'UserId'>();
export type UserId = z.infer<typeof UserId>;

export const Username = z
  .string('Invalid or missing username')
  .min(4, 'Username length must be between 4 and 20 characters')
  .max(20, 'Username length must be between 4 and 20 characters')
  .regex(/^[a-z0-9_]+$/i, 'Username can only contain letters, numbers and underscores')
  .brand<'Username'>();
export type Username = z.infer<typeof Username>;

export const Email = z.email('Invalid or missing email').max(254, 'Email is too long').brand<'Email'>();
export type Email = z.infer<typeof Email>;

export const EmailVerified = z.boolean();

export const Password = z
  .string('Invalid or missing password')
  .min(4, 'Password length must be between 4 and 20 characters')
  .max(20, 'Password length must be between 4 and 20 characters');

export const Token = z.jwt('Invalid JWT').brand<'Token'>();
export type Token = z.infer<typeof Token>;

// Media
export const MediaId = z.nanoid({
  pattern: /^[a-zA-Z0-9]{12}$/,
  error: 'Invalid media id, should be a 12 character long nanoid',
});

export const MimeType = z.enum(
  mediaPolicy.allowedMimeTypes,
  `Invalid mime type, should be one of: ${mediaPolicy.allowedMimeTypes.join(', ')}`,
);

export const Sha256Base64 = z
  .hash('sha256', {
    enc: 'base64',
    error: 'Invalid hash, should be sha256 base64 string',
  })
  .brand<'Sha256Base64'>();
export type Sha256Base64 = z.infer<typeof Sha256Base64>;

// Collections
export const CollectionId = z.nanoid({
  pattern: /^[a-zA-Z0-9]{12}$/,
  error: 'Invalid collection id, should be a 12 character long nanoid',
});
