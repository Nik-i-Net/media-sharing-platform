import type { User, UserWithIdentities } from './user';

export interface UsersRepository {
  save(user: User | UserWithIdentities): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByIdWithIdentities(id: string): Promise<UserWithIdentities | null>;
  existsByEmail(email: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
