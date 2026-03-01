import { z } from 'zod';
import { MediaId } from '../primitives.dto';

export const ConfirmUploadsRequest = z.object({
  mediaIds: z.array(MediaId).nonempty(),
});

export type ConfirmUploadsRequest = z.infer<typeof ConfirmUploadsRequest>;
