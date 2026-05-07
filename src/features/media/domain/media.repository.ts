import { Media } from '../domain/media';

export interface MediaRepository {
  save(media: Media): Promise<void>;
  findById(id: string): Promise<Media | null>;
  delete(id: string): Promise<boolean>;
}
