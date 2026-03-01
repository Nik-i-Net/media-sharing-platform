// TODO: (avatar, bio, links, whatever...)
import { z } from 'zod';

const UpdateUserRequest = z.object({}).brand<'UpdateUserRequest'>();
type UpdateUserRequest = z.infer<typeof UpdateUserRequest>;

export { UpdateUserRequest as UpdateUserDto };
