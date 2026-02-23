// TODO: avoid using String(), Number() or add additional assertions
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { UsersService } from '@src/modules/users/users.service.js';
import { UsersController } from '@src/modules/users/users.controller.js';
import { toCreateUserDto, fakeUser } from './fakes/users.fakes.js';
import { mockReq, mockRes } from '../../mocks/request.mocks.js';
import { StatusCodes } from 'http-status-codes';
import type { UsersRepository } from '@src/modules/users/users.repository.js';
import type { User } from '@src/modules/users/entities/user.entity.js';
import type { CreateUserDto } from '@src/modules/users/dto/create-user.dto.js';
import type { UpdateUserInfoDto } from '@src/modules/users/dto/update-user-info.dto.js';
import type { IdParams, Req, ReqWithBody, Res } from '@src/shared/types/request.types.js';

jest.mock('@src/modules/users/users.service.js');

const mockRepo = {} as UsersRepository;
const mockUsersService = new UsersService(mockRepo) as jest.Mocked<UsersService>;
const usersController = new UsersController(mockUsersService);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('usersController.createUser', () => {
  let user: ReturnType<typeof fakeUser>;
  let req: ReqWithBody<CreateUserDto>;
  let res: Res<User>;

  beforeEach(() => {
    user = fakeUser();
    req = mockReq({ body: toCreateUserDto(user) });
    res = mockRes<User>();
  });

  test('should call usersService.createUser and respond with the created user', async () => {
    mockUsersService.createUser.mockResolvedValueOnce(user);
    await usersController.createUser(req, res);

    expect(mockUsersService.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test('should propagate the service error', async () => {
    const error = new Error('usersService.createUser fails');

    mockUsersService.createUser.mockRejectedValueOnce(error);
    const promise = usersController.createUser(req, res);

    await expect(promise).rejects.toThrow(error);
  });
});

describe('usersController.getUserById', () => {
  let user: ReturnType<typeof fakeUser>;
  let req: Req<IdParams>;
  let res: Res<User>;

  beforeEach(() => {
    user = fakeUser();
    req = mockReq({ params: { id: String(user.id) } });
    res = mockRes<User>();
  });

  test('should call usersService.getUserById and respond with the found user`', async () => {
    mockUsersService.getUserById.mockResolvedValueOnce(user);
    await usersController.getUserById(req, res);

    expect(mockUsersService.getUserById).toHaveBeenCalledWith(Number(req.params.id));
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test('should propagate the service error', async () => {
    const error = new Error('usersService.getUserById fails');

    mockUsersService.getUserById.mockRejectedValueOnce(error);
    const promise = usersController.getUserById(req, res);

    await expect(promise).rejects.toThrow(error);
  });
});

describe('usersController.updateUserInfo', () => {
  let user: ReturnType<typeof fakeUser>;
  let req: Req<IdParams, UpdateUserInfoDto>;
  let res: Res<User>;

  beforeEach(() => {
    user = fakeUser();
    req = mockReq({ params: { id: String(user.id) }, body: {} });
    res = mockRes<User>();
  });

  test(`should call usersService.updateUserInfo and respond with the updated used`, async () => {
    mockUsersService.updateUserInfo.mockResolvedValueOnce(user);
    await usersController.updateUserInfo(req, res);

    expect(mockUsersService.updateUserInfo).toHaveBeenCalledWith(Number(req.params.id), req.body);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test('should propagate the service error', async () => {
    const error = new Error('usersService.updateUserInfo fails');

    mockUsersService.updateUserInfo.mockRejectedValueOnce(error);
    const promise = usersController.updateUserInfo(req, res);

    await expect(promise).rejects.toThrow(error);
  });
});

describe('usersController.deleteUser', () => {
  let user: ReturnType<typeof fakeUser>;
  let req: Req<IdParams>;
  let res: Res<void>;

  beforeEach(() => {
    user = fakeUser();
    req = mockReq({ params: { id: String(user.id) } });
    res = mockRes();
  });

  test(`should call usersService and respond with ${StatusCodes.NO_CONTENT}`, async () => {
    await usersController.deleteUser(req, res);

    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(Number(req.params.id));
    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
  });

  test('should propagate the service error', async () => {
    const error = new Error('usersService.deleteUser fails');

    mockUsersService.deleteUser.mockRejectedValueOnce(error);
    const promise = usersController.deleteUser(req, res);

    await expect(promise).rejects.toThrow(error);
  });
});
