import { z } from 'zod';
import { Email, Password } from '../primitives.dto';

export const UpdateEmailRequest = z.object({ newEmail: Email, password: Password }).brand<'UpdateEmailRequest'>();

export type UpdateEmailRequest = z.infer<typeof UpdateEmailRequest>;
