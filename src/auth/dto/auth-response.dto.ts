import { Token } from '@shared/application/primitives.dto.js';
import { UserDto } from 'src/users/dto/user.dto.js';
import z from 'zod';

export const AuthResponseDto = z
  .object({
    user: UserDto,
    accessToken: Token,
    refreshToken: Token,
  })
  .brand<'AuthResponseDto'>();
export type AuthResponseDto = z.infer<typeof AuthResponseDto>;
