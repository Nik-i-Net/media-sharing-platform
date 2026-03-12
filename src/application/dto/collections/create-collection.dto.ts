import { z } from 'zod';
import { UserIdSchema } from '../primitives.dto';

export const CreateCollectionDtoSchema = z.object({
  userId: UserIdSchema,
  collectionName: z.string().nonempty(),
});

export type CreateCollectionDto = z.infer<typeof CreateCollectionDtoSchema>;
