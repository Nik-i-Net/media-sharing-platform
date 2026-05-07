import { CollectionIdSchema } from '../../../shared/schemas/primitives.zod';
import { typedParser } from '../../../shared/schemas/utils';
import { z } from 'zod';

const CollectionItem = z.object({
  id: CollectionIdSchema,
  name: z.string(),
});

const ListCollectionsResponseSchema = z.object({
  collections: z.array(CollectionItem),
});

export const ListCollectionsResponse = typedParser(ListCollectionsResponseSchema);
export type ListCollectionsResponse = z.infer<typeof ListCollectionsResponseSchema>;
