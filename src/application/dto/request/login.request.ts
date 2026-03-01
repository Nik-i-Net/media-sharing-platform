import { z } from 'zod';
import { Username, Email, Password } from '../primitives.dto';

const identifier = z.union([Username, Email], "Invalid identifier, should be either 'username' or 'email'");

export const LoginRequest = z.object({ identifier, password: Password }).brand<'LoginRequest'>();
export type LoginRequest = z.infer<typeof LoginRequest>;
