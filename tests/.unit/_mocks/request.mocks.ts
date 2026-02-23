import { jest } from '@jest/globals';
import type { Req, Res } from '@src/shared/types/request.types.js';

// TODO: make props required if the corresponding generic was provided
function mockReq<Params, Body, Query>(
  data: {
    params?: Params;
    body?: Body;
    query?: Query;
  } = {},
): Req<Params, Body, Query> {
  return data as Req<Params, Body, Query>;
}

function mockRes<Body>() {
  type Input<T> = (input: T) => Res<Body>;
  type Status = Input<number>;
  type Json = Input<Body | undefined>;

  const res: jest.Mocked<Partial<Res<Body>>> = {
    status: jest.fn<Status>().mockReturnThis(),
    sendStatus: jest.fn<Status>(),
    json: jest.fn<Json>(),
    send: jest.fn<Json>(),
  };

  return res as jest.Mocked<Res<Body>>;
}

export { mockReq, mockRes };
