import { z } from 'zod';

// Users + Auth
export const UserIdSchema = z.uuidv4('Invalid UUID');

export const UsernameSchema = z
  .string('Invalid or missing username')
  .min(4, 'Username length must be between 4 and 20 characters')
  .max(20, 'Username length must be between 4 and 20 characters')
  .regex(/^[a-z0-9_]+$/i, 'Username can only contain letters, numbers and underscores');

export const EmailSchema = z.email('Invalid or missing email').max(254, 'Email is too long');

export const PasswordSchema = z
  .string('Invalid or missing password')
  .min(4, 'Password length must be between 4 and 20 characters')
  .max(20, 'Password length must be between 4 and 20 characters');

export const TokenSchema = z.jwt('Invalid JWT');

// Media
export const MediaIdSchema = z.nanoid({
  pattern: /^[a-zA-Z0-9]{12}$/,
  error: 'Invalid media id, should be a 12 character long nanoid',
});

export const Sha256Base64Schema = z
  .hash('sha256', {
    enc: 'base64',
    error: 'Invalid hash, should be sha256 base64 string',
  })
  .brand<'Sha256Base64'>();
export type Sha256Base64 = z.infer<typeof Sha256Base64Schema>;

// Collections
export const CollectionIdSchema = z.nanoid({
  pattern: /^[a-zA-Z0-9]{12}$/,
  error: 'Invalid collection id, should be a 12 character long nanoid',
});
