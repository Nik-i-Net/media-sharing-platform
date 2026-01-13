import type { Public } from '@common/types/branding.types.js';
import type { User } from '../user.entity.js';

export type PublicUser = Public<{
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
}>;

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
  } as PublicUser;
}
