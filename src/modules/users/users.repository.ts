import type { Knex } from 'knex';
import type { User } from './entities/user.entity.js';
import type { InsertUser, UpdateUser } from '@src/shared/database/types/users.table.js';

class UsersRepository {
  constructor(private readonly db: Knex) {}

  private get users() {
    return this.db('users');
  }

  async create(userData: InsertUser): Promise<User | null> {
    const [user] = await this.users.insert(userData).returning('*');
    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.users.where({ id });
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.users.where({ email });
    return user ?? null;
  }

  async update(id: string, updates: UpdateUser): Promise<User | null> {
    const [user] = await this.users.where({ id }).update(updates).returning('*');
    return user ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const count = await this.users.where({ id }).del();
    return count > 0;
  }
}

export { UsersRepository };
