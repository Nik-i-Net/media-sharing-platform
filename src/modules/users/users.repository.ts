import type { User } from './entities/user.entity.js';

type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateUserInput = Partial<CreateUserInput>;

let mockUsers: User[] = [];

class UsersRepository {
  constructor() {}

  async create(userInfo: CreateUserInput): Promise<User> {
    const id = (mockUsers.at(-1)?.id || 0) + 1;
    const now = new Date();
    const user: User = { id, ...userInfo, createdAt: now, updatedAt: now };
    mockUsers.push(user);
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = mockUsers.find((u) => u.id === id);
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
    const count = mockUsers.length;
    mockUsers = mockUsers.filter((user) => user.id !== id);
    return count - mockUsers.length;
  }
}

export { UsersRepository, type CreateUserInput, type UpdateUserInput };
