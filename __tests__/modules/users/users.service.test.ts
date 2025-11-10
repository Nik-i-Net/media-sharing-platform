import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { UsersService } from '@src/modules/users/users.service.js';
import { UsersRepository } from '@src/modules/users/users.repository.js';
import { existingId, fakeUser, nonExistentId } from './fakes/users.fakes.js';
import { USER_NOT_FOUND } from '@src/shared/errors/users.errors.js';
import type { CreateUserDto } from '@src/modules/users/dto/create-user.dto.js';
import type { UpdateUserInfoDto } from '@src/modules/users/dto/update-user-info.dto.js';

jest.mock('@src/modules/users/users.repository.js');

const mockUsersRepository = new UsersRepository() as jest.Mocked<UsersRepository>;
const usersService = new UsersService(mockUsersRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe('usersService.createUser', () => {
  test('should return the created user', () => {
    const user = fakeUser();
    const fakeCreateUserDto: CreateUserDto = { name: 'testName', age: 25 };

    mockUsersRepository.create.mockResolvedValueOnce(user);
    const promise = usersService.createUser(fakeCreateUserDto);

    expect(mockUsersRepository.create).toHaveBeenCalledWith(fakeCreateUserDto);
    expect(promise).resolves.toEqual(user);
  });
});

describe('usersService.getUserById', () => {
  test('should return the user when given an existing id', () => {
    const user = fakeUser({ id: existingId });

    mockUsersRepository.findById.mockResolvedValueOnce(user);
    const promise = usersService.getUserById(existingId);

    expect(mockUsersRepository.findById).toHaveBeenCalledWith(existingId);
    expect(promise).resolves.toEqual(user);
  });

  test(`should throw an error with message "${USER_NOT_FOUND}" when given a non-existent id`, () => {
    mockUsersRepository.findById.mockResolvedValueOnce(null);
    const promise = usersService.getUserById(nonExistentId);

    expect(mockUsersRepository.findById).toHaveBeenCalledWith(nonExistentId);
    expect(promise).rejects.toThrow(USER_NOT_FOUND);
  });
});

describe('usersService.updateUserInfo', () => {
  test('should return the updated user when given an existing id', () => {
    const user = fakeUser({ id: existingId });
    const fakeDto: UpdateUserInfoDto = { name: user.name };

    mockUsersRepository.update.mockResolvedValueOnce(user);
    const promise = usersService.updateUserInfo(existingId, fakeDto);

    expect(mockUsersRepository.update).toHaveBeenCalledWith(existingId, fakeDto);
    expect(promise).resolves.toEqual(user);
  });

  test(`should throw an error with message "${USER_NOT_FOUND}" when given a non-existent id`, () => {
    const fakeDto: UpdateUserInfoDto = { age: 25 };

    mockUsersRepository.update.mockResolvedValueOnce(null);
    const promise = usersService.updateUserInfo(nonExistentId, fakeDto);

    expect(mockUsersRepository.update).toHaveBeenCalledWith(nonExistentId, fakeDto);
    expect(promise).rejects.toThrow(USER_NOT_FOUND);
  });
});

describe('usersService.deleteUser', () => {
  test('should resolve successfully when given an existing id', () => {
    mockUsersRepository.delete.mockResolvedValueOnce(1);
    const promise = usersService.deleteUser(existingId);

    expect(mockUsersRepository.delete).toHaveBeenCalledWith(existingId);
    expect(promise).resolves.toBeUndefined();
  });

  test(`should throw an error with message "${USER_NOT_FOUND}" when given a non-existent id`, () => {
    mockUsersRepository.delete.mockResolvedValueOnce(0);
    const promise = usersService.deleteUser(nonExistentId);

    expect(mockUsersRepository.delete).toHaveBeenCalledWith(nonExistentId);
    expect(promise).rejects.toThrow(USER_NOT_FOUND);
  });
});

export { mockUsersRepository };
