import type { User } from './entities/user.entity.js';

type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateUserInput = Partial<CreateUserInput>;

class UsersRepository {
  private mockUsers: User[] = [];

  async create(userInfo: CreateUserInput): Promise<User> {
    const id = (this.mockUsers.at(-1)?.id || 0) + 1;
    const now = new Date();
    const user: User = { id, ...userInfo, createdAt: now, updatedAt: now };
    this.mockUsers.push(user);
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = this.mockUsers.find((u) => u.id === id);
    if (!user) {
      return null;
    }
    return user;
  }

  async update(id: number, userInfo: UpdateUserInput): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    Object.assign(user, userInfo, { updatedAt: new Date() });
    return user;
  }

  async delete(id: number): Promise<number> {
    const count = this.mockUsers.length;
    this.mockUsers = this.mockUsers.filter((user) => user.id !== id);
    return count - this.mockUsers.length;
  }
}

export const usersRepository = new UsersRepository();
