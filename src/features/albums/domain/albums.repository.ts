import type { Album } from './album';

export interface AlbumsRepository {
  save(album: Album): Promise<void>;
  findById(id: string): Promise<Album | null>;
  findAllByUserId(userId: string, limit?: number, offset?: number): Promise<Album[]>;
  existsById(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;

  addUploads(albumId: string, uploadIds: string[]): Promise<void>;
  removeUploads(albumId: string, uploadIds: string[]): Promise<void>;
}
