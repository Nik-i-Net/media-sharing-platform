import { Token } from '../primitives.dto';
import { strictParser } from '../strict-parser';
import { UserResponseSchema } from './user.response';
import z from 'zod';

export const AuthResponseSchema = z
  .object({
    user: UserResponseSchema,
    accessToken: Token,
  })
  .brand<'AuthResponse'>();

export const AuthResponse = { parse: strictParser(AuthResponseSchema) };
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
