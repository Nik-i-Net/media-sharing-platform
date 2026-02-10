import { z } from 'zod';
import { UserId } from '../primitives.dto';

export const AccessTokenPayload = z.object({
  sub: UserId,
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayload>;
