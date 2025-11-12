import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { mockReq, mockRes } from '../../mocks/request.mocks.js';
import { HttpError } from '@src/shared/errors/http.error.js';
import { StatusCodes } from 'http-status-codes';
import { errorHandler } from '@src/shared/middlewares/error-handler.middleware.js';
import type { Next, Req, Res } from '@src/shared/types/request.types.js';

let req: Req;
let res: Res;
let next: Next;
let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

beforeEach(() => {
  jest.clearAllMocks();
  req = mockReq();

  Object.defineProperty(req, 'method', { get: jest.fn(() => 'METHOD') });
  Object.defineProperty(req, 'url', { get: jest.fn(() => '/url') });

  res = mockRes();
  next = jest.fn();
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('err instanceof HttpError', () => {
  test('should respond with statusCode and message provided by the error without logging', () => {
    const message = 'HttpError test';
    const statusCode = StatusCodes.BAD_REQUEST;
    const err = new HttpError(message, statusCode);

    errorHandler(err, req, res, next);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(err.statusCode);
    expect(res.send).toHaveBeenCalledWith(err.message);
  });
});

describe('err instanceof Error', () => {
  test(`should log the endpoint and respond with ${StatusCodes.INTERNAL_SERVER_ERROR}`, () => {
    const message = 'Error test';
    const err = new Error(message);

    errorHandler(err, req, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, `[${req.method}] ${req.url}`);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, err.stack || err.message);
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

describe('err is a string', () => {
  test(`should log the endpoint and respond with ${StatusCodes.INTERNAL_SERVER_ERROR}`, () => {
    const err = 'string test';

    errorHandler(err, req, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, `[${req.method}] ${req.url}`);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, err);
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

describe('Unknown error', () => {
  test(`should log the endpoint and respond with ${StatusCodes.INTERNAL_SERVER_ERROR}`, () => {
    const err = null;

    errorHandler(err, req, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, `[${req.method}] ${req.url}`);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, 'Unknown error:', err);
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
