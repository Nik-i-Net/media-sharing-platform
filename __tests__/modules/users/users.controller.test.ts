// TODO: avoid using String(), Number() or add additional assertions
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { UsersService } from '@src/modules/users/users.service.js';
import { UsersController } from '@src/modules/users/users.controller.js';
import { toCreateUserDto, fakeUser } from './fakes/users.fakes.js';
import type { UsersRepository } from '@src/modules/users/users.repository.js';
import type { CreateUserDto } from '@src/modules/users/dto/create-user.dto.js';
import type { User } from '@src/modules/users/entities/user.entity.js';
import { mockReq, mockRes } from '../../mocks/request.mocks.js';
import { StatusCodes } from 'http-status-codes';
import type { IdParams, Req, ReqWithBody, Res } from '@src/shared/types/request.types.js';
import { USER_NOT_FOUND } from '@src/shared/errors/users.errors.js';
import type { UpdateUserInfoDto } from '@src/modules/users/dto/update-user-info.dto.js';

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

  test('should call usersService.createUser with provided `req.body`', async () => {
    await usersController.createUser(req, res);

    expect(mockUsersService.createUser).toHaveBeenCalledWith(req.body);
  });

  test(`should return the created user with status ${StatusCodes.CREATED}`, async () => {
    mockUsersService.createUser.mockResolvedValueOnce(user);
    await usersController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test(`should return status ${StatusCodes.INTERNAL_SERVER_ERROR} if an unknown error occurred`, async () => {
    mockUsersService.createUser.mockRejectedValueOnce(new Error());
    await usersController.createUser(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
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

  test('should call usersService.getUserById with provided `req.params.id`', async () => {
    await usersController.getUserById(req, res);

    expect(mockUsersService.getUserById).toHaveBeenCalledWith(Number(req.params.id));
  });

  test(`should return the found user`, async () => {
    mockUsersService.getUserById.mockResolvedValueOnce(user);
    await usersController.getUserById(req, res);

    expect(res.json).toHaveBeenCalledWith(user);
  });

  test(`should return status ${StatusCodes.NOT_FOUND} if the user not found`, async () => {
    mockUsersService.getUserById.mockRejectedValueOnce(new Error(USER_NOT_FOUND));
    await usersController.getUserById(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  test(`should return status ${StatusCodes.INTERNAL_SERVER_ERROR} if an unknown error occurred`, async () => {
    mockUsersService.getUserById.mockRejectedValueOnce(new Error());
    await usersController.getUserById(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
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

  test('should call usersService.updateUserInfo with provided `req.params.id` and `req.body`', async () => {
    await usersController.updateUserInfo(req, res);

    expect(mockUsersService.updateUserInfo).toHaveBeenCalledWith(Number(req.params.id), req.body);
  });

  test(`should return the updated user`, async () => {
    mockUsersService.updateUserInfo.mockResolvedValueOnce(user);
    await usersController.updateUserInfo(req, res);

    expect(res.json).toHaveBeenCalledWith(user);
  });

  test(`should return status ${StatusCodes.NOT_FOUND} if the user not found`, async () => {
    mockUsersService.updateUserInfo.mockRejectedValueOnce(new Error(USER_NOT_FOUND));
    await usersController.updateUserInfo(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  test(`should return status ${StatusCodes.INTERNAL_SERVER_ERROR} if an unknown error occurred`, async () => {
    mockUsersService.updateUserInfo.mockRejectedValueOnce(new Error());
    await usersController.updateUserInfo(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
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

  test('should call usersService.deleteUser with provided `req.params.id`', async () => {
    await usersController.deleteUser(req, res);

    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(Number(req.params.id));
  });

  test(`should return status ${StatusCodes.NO_CONTENT}`, async () => {
    await usersController.deleteUser(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
  });

  test(`should return status ${StatusCodes.NOT_FOUND} if the user not found`, async () => {
    mockUsersService.deleteUser.mockRejectedValueOnce(new Error(USER_NOT_FOUND));
    await usersController.deleteUser(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  test(`should return status ${StatusCodes.INTERNAL_SERVER_ERROR} if an unknown error occurred`, async () => {
    mockUsersService.deleteUser.mockRejectedValueOnce(new Error());
    await usersController.deleteUser(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
