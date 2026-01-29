import { z } from 'zod';
import { username, email, password } from '@shared/application/primitives.dto.js';

export const RegisterDto = z
  .object({ username, email, password, passwordConfirm: password })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "Passwords don't match",
    path: ['passwordConfirm'],
  })
  .brand<'RegisterDto'>();
export type RegisterDto = z.infer<typeof RegisterDto>;
