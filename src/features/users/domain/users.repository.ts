import type { User } from './user';

export interface UsersRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByExternalId(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
