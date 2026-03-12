import { z } from 'zod';
import { UserId } from '../primitives.dto';
import { InvalidTokenException } from '../../../core/errors/invalid-token.exception';

const RefreshTokenPayloadSchema = z.object({
  sub: UserId,
});

export const RefreshTokenPayload = {
  parse(data: unknown) {
    const parseResult = RefreshTokenPayloadSchema.safeParse(data);
    if (!parseResult.success) {
      throw new InvalidTokenException('Invalid refresh token');
    }

    return parseResult.data;
  },
};

export type RefreshTokenPayloadSchema = z.infer<typeof RefreshTokenPayloadSchema>;
