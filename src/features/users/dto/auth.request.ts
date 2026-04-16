import { z } from 'zod';

export const AuthRequestSchema = z.object({
  sub: z.string().regex(/^(auth0|google-oauth2)\|\w+$/),
  email: z
    .object({
      value: z.email(),
      verified: z.boolean(),
    })
    .nullable(),
});
