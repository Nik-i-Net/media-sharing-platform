import type { Plan } from './plan';
import type { User } from './user';

export interface UsersRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByExternalId(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;

  getUploadContext(userId: string): Promise<UserUploadContext | null>;
}

export interface UserUploadContext {
  currentTotalStorageBytes: number;
  plan: Plan;
}
