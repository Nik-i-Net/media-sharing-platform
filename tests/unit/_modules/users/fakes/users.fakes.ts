import type { CreateUserDto } from '@src/modules/users/dto/create-user.dto.js';
import type { User } from '@src/modules/users/entities/user.entity.js';

const existingId = 1;
const nonExistentId = 1e9;

const defaultUser: User = {
  id: existingId,
  name: 'defaultName',
  age: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function fakeUser(overrides: Partial<User> = {}): User {
  return { ...defaultUser, ...overrides };
}

function toCreateUserDto(user: User): CreateUserDto {
  const { name, age } = user;
  return { name, age };
}

export { fakeUser, toCreateUserDto, existingId, nonExistentId };
