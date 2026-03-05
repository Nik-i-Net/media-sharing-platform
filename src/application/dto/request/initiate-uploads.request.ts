import { z } from 'zod';
import { CollectionId, MimeType, Sha256Base64 } from '../primitives.dto';

const FileMetadata = z.object({
  filename: z.string().nonempty(),
  contentType: MimeType,
  contentLength: z.int().min(1),
  sha256base64: Sha256Base64,
});

export const InitiateUploadsRequest = z.object({
  files: z.array(FileMetadata).nonempty(),
  collectionId: CollectionId.optional(),
});

export type InitiateUploadsRequest = z.infer<typeof InitiateUploadsRequest>;
