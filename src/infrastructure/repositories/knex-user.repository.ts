import type { Knex } from 'knex';
import { UserMapper } from '../persistence/records/user.record';
import type { UserRecord } from '../persistence/records/user.record';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { User } from '../../domain/user';

export class KnexUserRepository implements UserRepository {
  constructor(private readonly db: Knex) {}

  async save(user: User): Promise<void> {
    const persistenceUser = UserMapper.toPersistence(user);
    await this.users
      .insert(persistenceUser)
      .onConflict('id')
      .merge(['username', 'email', 'emailVerified', 'passwordHash', 'updatedAt']);
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.users.where({ id }).del();
    return affectedRows > 0;
  }

  async findById(id: string): Promise<User | null> {
    return this.findBy('id', id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findBy('email', email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findBy('username', username);
  }

  async existsById(id: string): Promise<boolean> {
    return this.existsBy('id', id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.existsBy('email', email);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return this.existsBy('username', username);
  }

  private get users() {
    return this.db('users');
  }

  private async findBy<Column extends keyof UserRecord>(
    column: Column,
    value: UserRecord[Column],
  ): Promise<User | null> {
    const row = await this.users.where(column, value).first();
    if (!row) return null;
    return UserMapper.toDomain(row);
  }

  private async existsBy<Column extends keyof UserRecord>(column: Column, value: UserRecord[Column]): Promise<boolean> {
    const found = await this.users.where(column, value).first('id');
    return Boolean(found);
  }
}
