import { z } from 'zod';
import { Username, Email, Password } from '@shared/application/primitives.dto.js';

export const RegisterDto = z
  .object({ username: Username, email: Email, password: Password, passwordConfirm: Password })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "Passwords don't match",
    path: ['passwordConfirm'],
  })
  .brand<'RegisterDto'>();
export type RegisterDto = z.infer<typeof RegisterDto>;
