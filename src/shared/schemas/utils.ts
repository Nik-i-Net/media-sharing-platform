import { z } from 'zod';

// TODO: Replace with typedParser
export function strictParser<T extends z.ZodType>(schema: T) {
  return (data: z.input<T>) => schema.parse(data);
}

// TODO: do I even need this?
export function typedParser<T extends z.ZodType>(schema: T) {
  return {
    parse: (data: z.input<T>) => schema.parse(data),
  };
}
