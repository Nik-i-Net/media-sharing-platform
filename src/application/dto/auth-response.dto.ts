import { Token } from './primitives.dto';
import { UserDto } from './user.dto';
import z from 'zod';

export const AuthResponseDto = z
  .object({
    user: UserDto,
    accessToken: Token,
    refreshToken: Token,
  })
  .brand<'AuthResponseDto'>();
export type AuthResponseDto = z.infer<typeof AuthResponseDto>;
