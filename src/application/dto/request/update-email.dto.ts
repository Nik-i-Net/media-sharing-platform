import { z } from 'zod';
import { Email, Password } from '../primitives.dto';

export const UpdateEmailDto = z.object({ newEmail: Email, password: Password }).brand<'UpdateEmailDto'>();

export type UpdateEmailDto = z.infer<typeof UpdateEmailDto>;
