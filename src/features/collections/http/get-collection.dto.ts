import { CollectionIdSchema, MediaIdSchema } from '../../../shared/schemas/primitives.zod';
import { typedParser } from '../../../shared/schemas/utils';
import { z } from 'zod';

const MediaItem = z.object({
  id: MediaIdSchema,
  title: z.string(),
  link: z.httpUrl(),
  expiresAt: z.date(),
});

const GetCollectionResponseSchema = z.object({
  id: CollectionIdSchema,
  name: z.string(),
  media: z.array(MediaItem),
});

export const GetCollectionResponse = typedParser(GetCollectionResponseSchema);
export type GetCollectionResponse = z.infer<typeof GetCollectionResponseSchema>;
