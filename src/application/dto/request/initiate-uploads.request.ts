import { z } from 'zod';
import { CollectionId, MediaHash, MimeType } from '../primitives.dto';

const FileMetadata = z.object({
  filename: z.string().nonempty(),
  size: z.int().min(1),
  hash: MediaHash,
  mimeType: MimeType,
});

export const InitiateUploadsRequest = z.object({
  files: z.array(FileMetadata).nonempty(),
  collectionId: CollectionId.optional(),
});

export type InitiateUploadsRequest = z.infer<typeof InitiateUploadsRequest>;
