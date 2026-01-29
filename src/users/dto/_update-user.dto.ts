// TODO: (avatar, bio, links, whatever...)
import { z } from 'zod';

const UpdateUserDto = z.object({});
type UpdateUserDto = z.infer<typeof UpdateUserDto>;

export { UpdateUserDto };
