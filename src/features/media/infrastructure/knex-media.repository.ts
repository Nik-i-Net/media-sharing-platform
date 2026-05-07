import { Media } from '../domain/media';
import type { Knex } from 'knex';
import type { MediaRepository } from '../domain/media.repository';

export class KnexMediaRepository implements MediaRepository {
  constructor(private readonly db: Knex) {}

  async save(media: Media): Promise<void> {
    const data = this.toPersistence(media);
    await this.db('media') //
      .insert(data)
      .onConflict('id')
      .merge(['title', 'expires_at', 'updated_at']);
  }

  async findById(id: string): Promise<Media | null> {
    const record = await this.db('media').where({ id }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.db('media').where({ id }).del();
    return affectedRows > 0;
  }

  public toPersistence(media: Media): MediaRecord {
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

  public toDomain(record: MediaRecord): Media {
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

interface MediaRecord {
  id: string;
  user_id: string | null;
  blob_id: number;
  title: string;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
type InsertMediaRecord = MediaRecord;
type UpdateMediaRecord = Partial<Pick<MediaRecord, 'title' | 'expires_at' | 'updated_at'>>;

declare module 'knex/types/tables' {
  interface Tables {
    media: Knex.CompositeTableType<MediaRecord, InsertMediaRecord, UpdateMediaRecord>;
  }
}
