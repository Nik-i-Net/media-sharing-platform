import knex, { type Knex } from 'knex';
import knexConfig from '@config/knexfile';
import type { UserRecord, InsertUserRecord, UpdateUserRecord } from '@features/users/user.record';
import type { BlobRecord, InsertBlobRecord, UpdateBlobRecord } from '@features/media/blob.record';
import type { MediaRecord, InsertMediaRecord, UpdateMediaRecord } from '@features/media/media.record';
import type {
  CollectionRecord,
  InsertCollectionRecord,
  UpdateCollectionRecord,
} from '@features/collections/collection.record';

const db = knex(knexConfig);

declare module 'knex/types/tables' {
  interface Tables {
    users: Knex.CompositeTableType<UserRecord, InsertUserRecord, UpdateUserRecord>;
    blobs: Knex.CompositeTableType<BlobRecord, InsertBlobRecord, UpdateBlobRecord>;
    media: Knex.CompositeTableType<MediaRecord, InsertMediaRecord, UpdateMediaRecord>;
    collections: Knex.CompositeTableType<CollectionRecord, InsertCollectionRecord, UpdateCollectionRecord>;
  }
}

export default db;
