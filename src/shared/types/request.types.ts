/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express';

export type Req<Params = any, Body = any, Query = any> = Request<Params, any, Body, Query>;
export type ReqWithBody<Body> = Req<any, Body>;

export type Res<Body = any, Locals extends Record<string, any> = Record<string, any>> = Response<Body, Locals>;

export type Next = NextFunction;

export type IdParams = { id: string };
