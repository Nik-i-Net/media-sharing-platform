import { z } from 'zod';
import { Email, Password } from '@shared/application/primitives.dto.js';

export const UpdateEmailDto = z.object({ newEmail: Email, password: Password }).brand<'UpdateEmailDto'>();

export type UpdateEmailDto = z.infer<typeof UpdateEmailDto>;
