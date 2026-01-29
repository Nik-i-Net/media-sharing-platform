import { email, token, userId, username } from '@shared/application/primitives.dto.js';
import z from 'zod';

export const AuthResponseDto = z
  .object({
    user: { id: userId, username, email }, // NOTE: use UserDto
    accessToken: token,
    refreshToken: token,
  })
  .brand<'AuthResponseDto'>();
export type AuthResponseDto = z.infer<typeof AuthResponseDto>;
