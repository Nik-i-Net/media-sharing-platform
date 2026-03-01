import { z } from 'zod';
import { UserId, Username, Email, EmailVerified } from '../primitives.dto';
import { strictParser } from '../strict-parser';

export const UserResponseSchema = z
  .object({ id: UserId, username: Username, email: Email, emailVerified: EmailVerified })
  .brand<'UserResponse'>();

export const UserResponse = { parse: strictParser(UserResponseSchema) };
export type UserResponse = z.infer<typeof UserResponseSchema>;
