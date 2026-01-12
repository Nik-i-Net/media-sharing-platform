import type { Knex } from 'knex';
import type { User, UserInsert, UserUpdate } from './user.entity.js';
import { expectOne } from '@common/utils/assertions.js';

class UsersRepository {
  constructor(private readonly db: Knex) {}

  private get users() {
    return this.db('users');
  }

  async create(userData: UserInsert): Promise<User> {
    const rows = await this.users.insert(userData).returning('*');
    return expectOne(rows);
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.users.where({ id });
    return user ?? null;
  }

  async update(id: string, updates: UserUpdate): Promise<User | null> {
    const [user] = await this.users.where({ id }).update(updates).returning('*');
    return user ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const rowCount = await this.users.where({ id }).del();
    return rowCount > 0;
  }
}

export { UsersRepository };
