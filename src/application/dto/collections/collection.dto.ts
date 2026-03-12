import z from 'zod';
import { CollectionIdSchema, MediaIdSchema } from '../primitives.dto';

const MediaItem = z.object({
  id: MediaIdSchema,
  title: z.string(),
  link: z.httpUrl(),
  expiresAt: z.date(),
});

export const CollectionDtoSchema = z.object({
  id: CollectionIdSchema,
  title: z.string(),
  media: z.array(MediaItem),
  isPublic: z.boolean(),
  canEdit: z.boolean(),
});

export type CollectionDto = z.infer<typeof CollectionDtoSchema>;
