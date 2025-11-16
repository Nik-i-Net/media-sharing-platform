import type { User } from '@src/modules/users/entities/user.entity.js';
import type { Knex } from 'knex';

type UserDefaults = 'emailVerified' | 'createdAt' | 'updatedAt';
type InsertUser = Omit<User, UserDefaults>;
type UpdateUser = Partial<Omit<InsertUser, 'id'>>;

type UsersTable = Knex.CompositeTableType<User, InsertUser, UpdateUser>;

export type { UsersTable, InsertUser, UpdateUser };
