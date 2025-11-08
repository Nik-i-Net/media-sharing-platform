import type { User } from '@src/modules/users/entities/user.entity.js';

export function getFakeUser(userInfo: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'TestName',
    age: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...userInfo,
  };
}
