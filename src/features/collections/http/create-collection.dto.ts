import { UserIdSchema } from '../../../shared/schemas/primitives.zod';
import { z } from 'zod';

export const CreateCollectionDtoSchema = z.object({
  userId: UserIdSchema,
  collectionName: z.string().nonempty(),
});

export type CreateCollectionDto = z.infer<typeof CreateCollectionDtoSchema>;
