let mockUsers = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Alex' },
];

class UsersRepository {
  async create(userInfo) {
    const id = mockUsers.length ? mockUsers.at(-1).id + 1 : 1;
    mockUsers.push({ id, ...userInfo });
    const user = await this.findById(id);
    return user;
  }

  async findById(id) {
    const user = mockUsers.find((u) => u.id === id); // await knex
    if (!user) {
      return null;
    }
    return user;
  }

  async update(id, userInfo) {
    const user = await this.findById(id);
    if (!user) return null;

    Object.assign(user, userInfo);
    return user;
  }

  async delete(id) {
    const count = mockUsers.length;
    mockUsers = mockUsers.filter((user) => user.id !== id);
    return count - mockUsers.length;
  }
}

export const usersRepository = new UsersRepository();
