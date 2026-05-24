import type { z } from 'zod';

export abstract class BaseError extends Error {
  readonly timestamp: Date;

  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.timestamp = new Date();
    this.name = this.constructor.name;

    Object.defineProperty(this, 'message', { value: message, enumerable: true });
  }

  // TODO:
  // abstract toPublicResponse(): ErrorResponse;
}

export type ErrorResponse = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
};

export type OpenapiErrorResponse = {
  [statusCode: number]: {
    description: string;
    content: {
      'application/json': {
        schema: z.ZodObject<{
          error: z.ZodObject<{
            message: z.ZodString;
            code: z.ZodLiteral<string>;
          }>;
        }>;
      };
    };
  };
};
