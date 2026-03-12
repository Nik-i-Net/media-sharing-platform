import type { Request, Response, NextFunction } from 'express';

// export type Req<Params = unknown, Body = unknown, Query = unknown> = Request<Params, unknown, Body, Query>;
// export type ReqWithBody<Body> = Req<unknown, Body>;
// export type ReqWithQuery<Query> = Req<unknown, unknown, Query>;
//
// export type AuthedReq<Params = unknown, Body = unknown, Query = unknown> = Req<Params, Body, Query> & {
//   user: { id: string };
// };
// export type AuthedReqWithBody<Body = unknown> = AuthedReq<unknown, Body>;
// export type AuthedReqWithQuery<Query = unknown> = AuthedReq<unknown, unknown, Query>;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Res<Body = any> = Response<{
  data: Body | null;
  errors?: { message: string; code: string }[];
}>;

export type Next = NextFunction;

type UnknownValues = {
  params: unknown;
  body: unknown;
  query: unknown;
};

export type Req<T extends Partial<UnknownValues> = UnknownValues> = Request<
  T['params'],
  unknown,
  T['body'],
  T['query']
>;

export type AuthedReq<T extends Partial<UnknownValues> = UnknownValues> = Req<T> & {
  user: { id: string };
};
