/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express';

export type Req<Params = unknown, Body = unknown, Query = unknown> = Request<
  Params,
  unknown,
  Body,
  Query
>;
export type ReqWithBody<Body> = Req<unknown, Body>;
export type ReqWithQuery<Query> = Req<unknown, unknown, Query>;

export type Res<
  Body = unknown,
  Locals extends Record<string, any> = Record<string, any>,
> = Response<Body, Locals>;

export type Next = NextFunction;
