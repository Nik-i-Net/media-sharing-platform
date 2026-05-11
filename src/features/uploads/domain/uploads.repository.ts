import { Upload } from './upload';

export interface UploadsRepository {
  save(upload: Upload): Promise<void>;
  saveMany(uploads: Upload[]): Promise<void>;
  findById(id: string): Promise<Upload | null>;
  delete(id: string): Promise<boolean>;
}
