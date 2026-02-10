import { z } from 'zod';

export function strictParser<T extends z.ZodType>(schema: T) {
  return (data: z.input<T>) => schema.parse(data);
}
