import type { User } from '../user.js';

export interface UserRepository {
  save(user: User): Promise<void>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  existsById(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
}
