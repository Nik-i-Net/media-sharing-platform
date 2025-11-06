import type { Router } from 'express';

export interface Module {
  readonly path: string;
  register(router: Router): void;
}
