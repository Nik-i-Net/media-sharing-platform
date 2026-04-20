import { User } from '../domain/user';
import type { Knex } from 'knex';

export class UsersRepository {
  constructor(private readonly db: Knex | Knex.Transaction) {}

  async save(user: User): Promise<void> {
    const data = this.toPersistence(user);
    await this.db('users')
      .insert(data)
      .onConflict('id')
      .merge(['email', 'email_verified', 'updated_at']);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.db('users').where({ id }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.db('users').where({ email }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const found = await this.db('users').where({ email }).first('id');
    return Boolean(found);
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.db('users').where({ id }).del();
    return affectedRows > 0;
  }

  private toPersistence(user: User): UserRecord {
    return {
      id: user.id,
      email: user.email,
      email_verified: user.emailVerified,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  private toDomain(record: UserRecord): User {
    return new User({
      id: record.id,
      email: record.email,
      emailVerified: record.email_verified,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
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

declare module 'knex/types/tables' {
  interface Tables {
    users: Knex.CompositeTableType<UserRecord, InsertUserRecord, UpdateUserRecord>;
  }
}
