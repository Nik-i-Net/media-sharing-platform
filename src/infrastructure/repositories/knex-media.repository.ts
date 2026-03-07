import type { Knex } from 'knex';
import type { MediaRepository } from '../../domain/repositories/media.repository';
import type { Media } from '../../domain/entities/media';
import { MediaMapper } from '../persistence/records/media.record';

export class KnexMediaRepository implements MediaRepository {
  constructor(private readonly db: Knex) {}

  async save(media: Media): Promise<void> {
    const data = MediaMapper.toPersistence(media);
    await this.media //
      .insert(data)
      .onConflict('id')
      .merge(['title', 'expires_at', 'updated_at']);
  }

  async findById(id: string): Promise<Media | null> {
    const record = await this.media.where({ id }).first();
    if (!record) return null;
    return MediaMapper.toDomain(record);
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.media.where({ id }).del();
    return affectedRows > 0;
  }

  private get media() {
    return this.db('media');
  }
}
