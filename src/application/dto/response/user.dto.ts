import { z } from 'zod';
import { UserId, Username, Email, EmailVerified } from '../primitives.dto';
import { strictParser } from '../strict-parser';

export const UserSchema = z
  .object({ id: UserId, username: Username, email: Email, emailVerified: EmailVerified })
  .brand<'UserDto'>();

export const UserDto = { parse: strictParser(UserSchema) };
export type UserDto = z.infer<typeof UserSchema>;
