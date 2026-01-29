import { z } from 'zod';
import { username, email, password } from '@shared/application/primitives.dto.js';

const identifier = z.union([username, email]);

export const LoginDto = z.object({ identifier, password }).brand<'LoginDto'>();
export type LoginDto = z.infer<typeof LoginDto>;
