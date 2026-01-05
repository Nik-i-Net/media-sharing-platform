import type { User } from '@src/modules/users/entities/user.entity.js';
import type { CamelToSnake } from '@src/shared/utils/convertBetweenCamelAndSnakeCases.js';
import type { Knex } from 'knex';


type UserDefaults = 'emailVerified' | 'createdAt' | 'updatedAt';
type UserInsert = Omit<User, UserDefaults>;
type UserUpdate = Partial<Omit<UserInsert, 'id'>>;

type UsersTable = Knex.CompositeTableType<
  CamelToSnake<User>,
  CamelToSnake<UserInsert>,
  CamelToSnake<UserUpdate>
>;

export type { UsersTable, UserInsert, UserUpdate }

