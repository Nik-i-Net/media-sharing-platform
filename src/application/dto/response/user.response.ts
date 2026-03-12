import { z } from 'zod';
import { strictParser } from '../utils';
import { UserIdSchema, UsernameSchema, EmailSchema } from '../primitives.dto';

export const UserDtoSchema = z
  .object({
    id: UserIdSchema,
    username: UsernameSchema,
    email: EmailSchema,
    emailVerified: z.boolean(),
  })
  .brand<'UserDto'>();

export const UserResponse = { parse: strictParser(UserResponseSchema) };
export type UserResponse = z.infer<typeof UserResponseSchema>;
