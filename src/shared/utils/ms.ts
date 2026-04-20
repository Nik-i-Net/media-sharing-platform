import type { Duration, DurationUnit } from '../types';

export function ms(duration: Duration): number {
  const value = parseFloat(duration);
  const unit = duration.at(-1) as DurationUnit;

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 1000 * 60;
    case 'h':
      return value * 1000 * 60 * 60;
    case 'd':
      return value * 1000 * 60 * 60 * 24;
    default:
      throw new Error(`Unexpected unit: ${unit satisfies never}`);
  }
}
