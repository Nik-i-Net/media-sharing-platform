import { z } from 'zod';
import { CollectionId, MediaId } from '../primitives.dto';
import { typedParser } from '../utils';

const MediaItem = z.object({
  id: MediaId,
  title: z.string(),
  link: z.httpUrl(),
  expiresAt: z.date(),
});

const GetCollectionResponseSchema = z.object({
  id: CollectionId,
  name: z.string(),
  media: z.array(MediaItem),
});

export const GetCollectionResponse = typedParser(GetCollectionResponseSchema);
export type GetCollectionResponse = z.infer<typeof GetCollectionResponseSchema>;
