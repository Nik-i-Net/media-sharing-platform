import { z } from 'zod';
import { Username, Email, Password } from '../primitives.dto';

export const RegisterRequest = z
  .object({ username: Username, email: Email, password: Password, passwordConfirm: Password })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "Passwords don't match",
    path: ['passwordConfirm'],
  })
  .brand<'RegisterRequest'>();
export type RegisterRequest = z.infer<typeof RegisterRequest>;
