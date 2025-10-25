import { usersRepository } from '../../../src/modules/users/users.repository';
import type { CreateUserDto } from '../../../src/modules/users/dto/create-user.dto';
import type { UpdateUserInfoDto } from '../../../src/modules/users/dto/update-user-info.dto';

const userInfo1: CreateUserDto = { name: 'Alex', age: 25 };
const userInfo2: CreateUserDto = { name: 'Jane', age: 30 };

describe('usersRepository.create', () => {
  test('should return a user object with expected fields', async () => {
    const user = await usersRepository.create(userInfo1);
    expect(user).toEqual({
      id: expect.any(Number),
      name: userInfo1.name,
      age: userInfo1.age,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  test('should assign unique ids to different users', async () => {
    const user1 = await usersRepository.create(userInfo1);
    const user2 = await usersRepository.create(userInfo2);
    expect(user1.id).not.toBe(user2.id);
  });
});

describe('usersRepository.findById', () => {
  test('should return the user when given a valid id', async () => {
    const createdUser = await usersRepository.create(userInfo1);
    const foundUser = await usersRepository.findById(createdUser.id);
    expect(foundUser).toEqual(createdUser);
  });

  test('should return null when user does not exist', async () => {
    const user = await usersRepository.findById(Number.MAX_SAFE_INTEGER);
    expect(user).toBeNull();
  });
});

describe('usersRepository.update', () => {
  test('should update the name of an existing user', async () => {
    const createdUser = await usersRepository.create(userInfo1);
    const updatedInfo: UpdateUserInfoDto = { name: 'not' + userInfo1.name };
    await usersRepository.update(createdUser.id, updatedInfo);
    const updatedUser = await usersRepository.findById(createdUser.id);
    expect(updatedUser).toMatchObject({
      id: createdUser.id,
      name: updatedInfo.name,
      age: createdUser.age,
    });
  });

  test('should return null if the user does not exist', async () => {
    const count = await usersRepository.update(Number.MAX_SAFE_INTEGER, {
      name: 'newName',
    });
    expect(count).toBeNull();
  });
});

describe('usersRepository.delete', () => {
  test('should delete an existing user', async () => {
    const createdUser = await usersRepository.create(userInfo1);
    await usersRepository.delete(createdUser.id);
    const foundUser = await usersRepository.findById(createdUser.id);
    expect(foundUser).toBeNull();
  });

  test('should return 0 if the user does not exist', async () => {
    const count = await usersRepository.delete(Number.MAX_SAFE_INTEGER);
    expect(count).toBe(0);
  });
});
