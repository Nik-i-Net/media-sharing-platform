import type { Knex } from 'knex';
import { UserMapper } from '../persistence/records/user.record';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { User } from '../../domain/entities/user';

export class KnexUserRepository implements UserRepository {
  constructor(private readonly db: Knex) {}

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.users
      .insert(data)
      .onConflict('id')
      .merge(['username', 'email', 'email_verified', 'password_hash', 'updated_at']);
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.users.where({ id }).del();
    return affectedRows > 0;
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.users.where({ id }).first();
    if (!record) return null;
    return UserMapper.toDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.users.where({ email }).first();
    if (!record) return null;
    return UserMapper.toDomain(record);
  }

  async findByUsername(username: string): Promise<User | null> {
    const record = await this.users.where({ username }).first();
    if (!record) return null;
    return UserMapper.toDomain(record);
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

  private get users() {
    return this.db('users');
  }
}
