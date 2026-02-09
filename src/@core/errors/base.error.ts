import type { Values } from '@core/types';
import type { codes } from './constants';

// export interface ErrorDetail {
//   message: string;
//   reason: Values<typeof reasons>;
//   field?: string;
// }

export abstract class BaseError extends Error {
  public readonly timestamp: Date;

  constructor(
    message: string,
    public readonly code: Values<typeof codes>,
  ) {
    super(message);
    this.timestamp = new Date();
    this.name = this.constructor.name;
  }
}
