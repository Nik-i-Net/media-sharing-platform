import type { Request, Response, NextFunction } from 'express';

export type Req<Params = unknown, Body = unknown, Query = unknown> = Request<Params, unknown, Body, Query> & {
  user?: { userId: string };
};
export type ReqWithBody<Body> = Req<unknown, Body>;
export type ReqWithQuery<Query> = Req<unknown, unknown, Query>;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Res<Body = any> = Response<Body>;

export type Next = NextFunction;
