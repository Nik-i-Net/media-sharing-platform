import knex, { type Knex } from 'knex';
import knexConfig from '@config/knexfile';
import type { UserRecord, InsertUserRecord, UpdateUserRecord } from './records/user.record';
import type { BlobRecord, InsertBlobRecord, UpdateBlobRecord } from './records/blob.record';
import type { MediaRecord, InsertMediaRecord, UpdateMediaRecord } from './records/media.record';

const db = knex(knexConfig);

declare module 'knex/types/tables' {
  interface Tables {
    users: Knex.CompositeTableType<UserRecord, InsertUserRecord, UpdateUserRecord>;
    blobs: Knex.CompositeTableType<BlobRecord, InsertBlobRecord, UpdateBlobRecord>;
    media: Knex.CompositeTableType<MediaRecord, InsertMediaRecord, UpdateMediaRecord>;
  }
}

export default db;
