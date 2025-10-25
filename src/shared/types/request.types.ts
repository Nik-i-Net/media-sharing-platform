import type { Request, Response } from 'express';

export type Req<Params = unknown, Body = unknown, Query = unknown> = Request<Params, any, Body, Query>; // eslint-disable-line @typescript-eslint/no-explicit-any
export type ReqWithBody<Body extends object> = Req<object, Body>;

export type Res<Body = unknown, Locals extends Record<string, any> = Record<string, any>> = Response<Body, Locals>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type IdParams = { id: string };
