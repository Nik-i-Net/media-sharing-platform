import type { Knex } from 'knex';
import type { User } from './entities/user.entity.js';
import type { UserInsert, UserUpdate } from '@src/shared/database/types/users.table.js';
import { InternalServerError } from '@src/shared/errors/internal-server.error.js';
import { AlreadyTakenError } from '@src/shared/errors/already-taken.error.js';
import { camelToSnake, snakeToCamel } from '@src/shared/utils/convertBetweenCamelAndSnakeCases.js';


class UsersRepository {
  constructor(private readonly db: Knex) { }

  private get users() {
    return this.db('users');
  }

  async create(userData: UserInsert): Promise<User> {
    try {
      const [user] = await this.users.insert(camelToSnake(userData)).returning('*');
      if (!user) throw new InternalServerError('Failed to create user');
      return snakeToCamel(user);
    } catch (err: any) {
      console.log("code:", err?.code);
      throw new AlreadyTakenError("Username|Email");
    }
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.users.where({ id });
    if (!user) return null;
    return snakeToCamel(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.users.where({ email });
    if (!user) return null;
    return snakeToCamel(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await this.users.where({ username });
    if (!user) return null;
    return snakeToCamel(user);
  }

  async update(id: string, updates: UserUpdate): Promise<User | null> {
    const [user] = await this.users.where({ id }).update(updates).returning('*');
    if (!user) return null;
    return snakeToCamel(user);
  }

  async delete(id: string): Promise<boolean> {
    const count = await this.users.where({ id }).del();
    return count > 0;
  }
}

export { UsersRepository };
