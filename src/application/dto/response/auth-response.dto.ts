import { Token } from '../primitives.dto';
import { strictParser } from '../strict-parser';
import { UserSchema } from './user.dto';
import z from 'zod';

export const AuthResponseSchema = z
  .object({
    user: UserSchema,
    accessToken: Token,
  })
  .brand<'AuthResponseDto'>();

export const AuthResponseDto = { parse: strictParser(AuthResponseSchema) };
export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;
