import { z } from 'zod';

// Users + Auth
export const userId = z.uuidv4('Invalid UUID').brand<'UserId'>();
export type UserId = z.infer<typeof userId>;

export const username = z
  .string()
  .min(4, 'Username length must be between 4 and 20 characters')
  .max(20, 'Username length must be between 4 and 20 characters')
  .regex(/^[a-z0-9_]+$/i, 'Username can only contain letters, numbers and underscores')
  .brand<'Username'>();
export type Username = z.infer<typeof username>;

export const email = z.email('Invalid email').max(254, 'Email is too long').brand<'Email'>();
export type Email = z.infer<typeof email>;

export const emailVerified = z.boolean();

export const password = z
  .string()
  .min(4, 'Password length must be between 4 and 20 characters')
  .max(20, 'Password length must be between 4 and 20 characters');

export const token = z.jwt('Invalid JWT').brand<'Token'>();
export type Token = z.infer<typeof token>;

// Media
export const mediaId = z.uuidv4('Invalid UUID');

export const mediaTitle = z
  .string()
  .min(4, 'Media title length must be between 4 and 20 characters')
  .max(20, 'Media title length must be between 4 and 20 characters');

// Collections
export const collectionId = z.uuidv4('Invalid UUID');

export const collectionName = z
  .string()
  .min(4, 'Collection name length must be between 4 and 20 characters')
  .max(20, 'Collection name length must be between 4 and 20 characters');

export const collectionTTL = z.enum(
  ['1h', '1d', '7d', '30d', 'never'],
  'Invalid period, should be one of: 1h, 1d, 7d, 30d or never',
);
