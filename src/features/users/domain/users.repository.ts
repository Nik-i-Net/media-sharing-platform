import type { User } from './user';

export interface UsersRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
