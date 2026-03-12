import z from 'zod';
import { CollectionDtoSchema } from './collection.dto';

export const CollectionSummaryDtoSchema = CollectionDtoSchema.pick({
  id: true,
  title: true,
});

export type CollectionSummaryDto = z.infer<typeof CollectionSummaryDtoSchema>;
