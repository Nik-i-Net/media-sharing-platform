import type { Knex } from 'knex';
import { User } from '../entities/user';

export class UsersRepository {
  constructor(private readonly db: Knex | Knex.Transaction) {}

  async save(user: User): Promise<void> {
    const data = this.toPersistence(user);
    await this.users.insert(data).onConflict('id').merge(['email', 'email_verified', 'updated_at']);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.users.where({ id }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.users.where({ email }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const found = await this.users.where({ email }).first('id');
    return Boolean(found);
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.users.where({ id }).del();
    return affectedRows > 0;
  }

  private get users() {
    return this.db('users');
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

export interface UserRecord {
  id: string;
  email: string | null;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export type InsertUserRecord = UserRecord;
export type UpdateUserRecord = Partial<Pick<UserRecord, 'email' | 'email_verified' | 'updated_at'>>;
