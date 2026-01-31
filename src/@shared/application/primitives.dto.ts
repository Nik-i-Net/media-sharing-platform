import { z } from 'zod';

// Users + Auth
export const UserId = z.uuidv4('Invalid UUID').brand<'UserId'>();
export type UserId = z.infer<typeof UserId>;

export const Username = z
  .string()
  .min(4, 'Username length must be between 4 and 20 characters')
  .max(20, 'Username length must be between 4 and 20 characters')
  .regex(/^[a-z0-9_]+$/i, 'Username can only contain letters, numbers and underscores')
  .brand<'Username'>();
export type Username = z.infer<typeof Username>;

export const Email = z.email('Invalid email').max(254, 'Email is too long').brand<'Email'>();
export type Email = z.infer<typeof Email>;

export const EmailVerified = z.boolean();

export const Password = z
  .string()
  .min(4, 'Password length must be between 4 and 20 characters')
  .max(20, 'Password length must be between 4 and 20 characters');

export const Token = z.jwt('Invalid JWT').brand<'Token'>();
export type Token = z.infer<typeof Token>;

// Media
export const MediaId = z.uuidv4('Invalid UUID');

export const MediaTitle = z
  .string()
  .min(4, 'Media title length must be between 4 and 20 characters')
  .max(20, 'Media title length must be between 4 and 20 characters');

// Collections
export const CollectionId = z.uuidv4('Invalid UUID');

export const CollectionName = z
  .string()
  .min(4, 'Collection name length must be between 4 and 20 characters')
  .max(20, 'Collection name length must be between 4 and 20 characters');

export const CollectionTTL = z.enum(
  ['3h', '1d', '7d', '30d'],
  'Invalid period, should be one of: 1h, 1d, 7d, 30d or never',
);
