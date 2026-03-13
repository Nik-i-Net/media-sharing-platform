import { User } from './entities/user';
import type { Knex } from 'knex';

export interface UsersRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  existsById(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export class KnexUsersRepository implements UsersRepository {
  constructor(private readonly db: Knex) {}

  async save(user: User): Promise<void> {
    const data = this.toPersistence(user);
    await this.users
      .insert(data)
      .onConflict('id')
      .merge(['username', 'email', 'email_verified', 'password_hash', 'updated_at']);
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

  async findByUsername(username: string): Promise<User | null> {
    const record = await this.users.where({ username }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async existsById(id: string): Promise<boolean> {
    const found = await this.users.where({ id }).first('id');
    return Boolean(found);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const found = await this.users.where({ email }).first('id');
    return Boolean(found);
  }

  async existsByUsername(username: string): Promise<boolean> {
    const found = await this.users.where({ username }).first('id');
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
      username: user.username,
      email: user.email,
      email_verified: user.emailVerified,
      password_hash: user.passwordHash,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  private toDomain(record: UserRecord): User {
    return new User(
      record.id,
      record.username,
      record.email,
      record.email_verified,
      record.password_hash,
      record.created_at,
      record.updated_at,
    );
  }
}

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export type InsertUserRecord = UserRecord;
export type UpdateUserRecord = Partial<
  Pick<UserRecord, 'username' | 'email' | 'email_verified' | 'password_hash' | 'updated_at'>
>;
