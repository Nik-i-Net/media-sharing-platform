import { z } from 'zod';
import { UserId, Username, Email, EmailVerified } from '@shared/application/primitives.dto.js';

export const UserDto = z
  .object({ id: UserId, username: Username, email: Email, emailVerified: EmailVerified })
  .brand<'UserDto'>();
export type UserDto = z.infer<typeof UserDto>;
