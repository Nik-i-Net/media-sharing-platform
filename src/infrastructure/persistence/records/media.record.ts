import { Media } from '../../../domain/entities/media';

export interface MediaRecord {
  id: string;
  user_id: string | null;
  blob_id: number;
  title: string;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type InsertMediaRecord = MediaRecord;
export type UpdateMediaRecord = Partial<Pick<MediaRecord, 'title' | 'expires_at' | 'updated_at'>>;

export class MediaMapper {
  public static toPersistence(media: Media): MediaRecord {
    return {
      id: media.id,
      user_id: media.userId,
      blob_id: media.blobId,
      title: media.title,
      expires_at: media.expiresAt,
      created_at: media.createdAt,
      updated_at: media.updatedAt,
    };
  }

  public static toDomain(record: MediaRecord): Media {
    return new Media(
      record.id,
      record.user_id,
      record.blob_id,
      record.title,
      record.expires_at,
      record.created_at,
      record.updated_at,
    );
  }
}
