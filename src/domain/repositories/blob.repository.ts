export interface BlobRepository {
  save(blob: Blob): Promise<void>;
  findByHash(hash: string): Promise<Blob | null>;
}
