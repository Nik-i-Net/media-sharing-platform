import type { Media } from '../entities/media';

export interface MediaRepository {
  save(media: Media): Promise<void>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Media | null>;
}
