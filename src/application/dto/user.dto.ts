import { z } from 'zod';
import { UserId, Username, Email, EmailVerified } from './primitives.dto';

export const UserDto = z
  .object({ id: UserId, username: Username, email: Email, emailVerified: EmailVerified })
  .brand<'UserDto'>();
export type UserDto = z.infer<typeof UserDto>;
