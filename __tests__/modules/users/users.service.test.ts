import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { UsersService } from '@src/modules/users/users.service.js';
import { UsersRepository } from '@src/modules/users/users.repository.js';
import type { CreateUserDto } from '@src/modules/users/dto/create-user.dto.js';
import type { User } from '@src/modules/users/entities/user.entity.js';

const mockUsersRepository: jest.Mocked<UsersRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const usersService = new UsersService(mockUsersRepository);

const fakeUserDto: CreateUserDto = { name: 'TestName', age: 25 };
function getFakeUser(userInfo: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'TestName',
    age: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...userInfo,
  };
}

const existingId = 1;
const nonExistentId = 999;
const USER_NOT_FOUND = 'User not found';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('usersService.createUser', () => {
  test('should return a user object with expected fields', () => {
    const fakeUser = getFakeUser();
    mockUsersRepository.create.mockResolvedValueOnce(fakeUser);

    const promise = usersService.createUser(fakeUserDto);
    expect(promise).resolves.toEqual(fakeUser);
  });
});

describe('usersService.getUserById', () => {
  test('should return the user when given an existing id', () => {
    const fakeUser = getFakeUser({ id: existingId });
    mockUsersRepository.findById.mockResolvedValueOnce(fakeUser);
    const promise = usersService.getUserById(existingId);
    expect(promise).resolves.toEqual(fakeUser);
  });

  test(`should throw an error with message "${USER_NOT_FOUND}" when given a non-existent id`, () => {
    mockUsersRepository.findById.mockResolvedValueOnce(null);
    const promise = usersService.getUserById(nonExistentId);
    expect(promise).rejects.toThrow(USER_NOT_FOUND);
  });
});

describe('usersService.updateUserInfo', () => {
  test('should return the user with updated name when given an existing id', () => {
    const fakeUser = getFakeUser({ id: existingId });
    mockUsersRepository.update.mockResolvedValueOnce(fakeUser);
    const promise = usersService.updateUserInfo(existingId, { name: fakeUser.name });
    expect(promise).resolves.toEqual(fakeUser);
  });

  test(`should throw an error with message "${USER_NOT_FOUND}" when given a non-existent id`, () => {
    mockUsersRepository.update.mockResolvedValueOnce(null);
    const promise = usersService.updateUserInfo(nonExistentId, { age: 25 });
    expect(promise).rejects.toThrow(USER_NOT_FOUND);
  });
});

describe('usersService.deleteUser', () => {
  test('should resolve successfully when given an existing id', () => {
    mockUsersRepository.delete.mockResolvedValueOnce(1);
    const promise = usersService.deleteUser(existingId);
    expect(promise).resolves.toBeUndefined();
  });

  test(`should throw an error with message "${USER_NOT_FOUND}" when given a non-existent id`, () => {
    mockUsersRepository.delete.mockResolvedValueOnce(0);
    const promise = usersService.deleteUser(nonExistentId);
    expect(promise).rejects.toThrow(USER_NOT_FOUND);
  });
});
