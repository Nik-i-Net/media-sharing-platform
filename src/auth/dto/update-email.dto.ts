import { z } from 'zod';
import { email, password } from '@shared/application/primitives.dto.js';

export const UpdateEmailDto = z.object({ newEmail: email, password }).brand<'UpdateEmailDto'>();

export type UpdateEmailDto = z.infer<typeof UpdateEmailDto>;
