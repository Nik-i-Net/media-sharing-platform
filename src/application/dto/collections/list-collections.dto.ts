import { z } from 'zod';
import { CollectionId } from '../primitives.dto';
import { typedParser } from '../utils';

const CollectionItem = z.object({
  id: CollectionId,
  name: z.string(),
});

const ListCollectionsResponseSchema = z.object({
  collections: z.array(CollectionItem),
});

export const ListCollectionsResponse = typedParser(ListCollectionsResponseSchema);
export type ListCollectionsResponse = z.infer<typeof ListCollectionsResponseSchema>;
