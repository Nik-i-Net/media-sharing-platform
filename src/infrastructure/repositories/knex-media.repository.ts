import type { Knex } from 'knex';
import type { MediaRepository } from '../../domain/repositories/media.repository';
import type { Media } from '../../domain/media';

export class KnexMediaRepository implements MediaRepository {
  constructor(private readonly db: Knex) {}

  async save(_media: Media): Promise<void> {
    throw new Error('KnexMediaRepository.save not implemented.');
  }

  async findById(_id: string): Promise<Media | null> {
    throw new Error('KnexMediaRepository.findById not implemented.');
  }

  async delete(_id: string): Promise<boolean> {
    throw new Error('KnexMediaRepository.delete not implemented.');
  }
}
