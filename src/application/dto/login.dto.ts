import { z } from 'zod';
import { Username, Email, Password } from './primitives.dto.js';

const identifier = z.union([Username, Email], "Invalid identifier, should be either 'username' or 'email'");

export const LoginDto = z.object({ identifier, password: Password }).brand<'LoginDto'>();
export type LoginDto = z.infer<typeof LoginDto>;
