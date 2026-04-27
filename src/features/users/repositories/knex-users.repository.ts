import { User, UserWithIdentities } from '../domain/user';
import type { Knex } from 'knex';
import type { UsersRepository } from '../domain/users.repository';

export class KnexUsersRepository implements UsersRepository {
  constructor(private readonly db: Knex | Knex.Transaction) {}

  async save(user: User | UserWithIdentities): Promise<void> {
    await this.db('users')
      .insert({
        id: user.id,
        email: user.email,
        email_verified: user.emailVerified,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      })
      .onConflict('id')
      .merge(['email', 'email_verified', 'updated_at']);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.db('users').where({ id }).first();
    if (!record) return null;
    return User.restore({
      id: record.id,
      email: record.email,
      emailVerified: record.email_verified,
      totalStorageBytes: 0,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
  }

  // NOTE: .join() doesn't support type inference.
  // Works only for `select *` which is not ideal since both tables have same columns.
  // TODO: migrate to Drizzle ORM
  async findByIdWithIdentities(id: string): Promise<UserWithIdentities | null> {
    const data = await this.db('users')
      .where({ id })
      .join('identities', 'users.id', 'identities.user_id')
      .select('email_verified');
    // .where({ id })
    // .join('identities', 'users.id', '=', 'identities.user_id')
    if (!data) return null;
    return UserWithIdentities.restore({} as UserWithIdentities);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const found = await this.db('users').where({ email }).first('id');
    return Boolean(found);
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.db('users').where({ id }).del();
    return affectedRows > 0;
  }
}

interface UserRecord {
  id: string;
  email: string | null;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
type InsertUserRecord = UserRecord;
type UpdateUserRecord = Partial<Pick<UserRecord, 'email' | 'email_verified' | 'updated_at'>>;

interface IdentityRecord {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id: string;
  email: string | null;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
type InsertIdentityRecord = IdentityRecord;
type UpdateIdentityRecord = Partial<
  Pick<IdentityRecord, 'email' | 'email_verified' | 'updated_at'>
>;

declare module 'knex/types/tables' {
  interface Tables {
    users: Knex.CompositeTableType<UserRecord, InsertUserRecord, UpdateUserRecord>;
    identities: Knex.CompositeTableType<IdentityRecord, InsertIdentityRecord, UpdateIdentityRecord>;
  }
}
