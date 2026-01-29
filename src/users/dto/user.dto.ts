import { z } from 'zod';
import { userId, username, email, emailVerified } from '@shared/application/primitives.dto.js';

export const UserDto = z.object({ id: userId, username, email, emailVerified }).brand<'UserDto'>();
export type UserDto = z.infer<typeof UserDto>;
