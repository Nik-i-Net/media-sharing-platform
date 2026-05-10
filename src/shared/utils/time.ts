export type DurationUnit = 's' | 'm' | 'h' | 'd';
export type Duration = `${number}${DurationUnit}`;

export function ms(dur: Duration): number {
  const value = parseFloat(dur);
  const unit = dur.at(-1) as DurationUnit;

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

export function duration(d1: Duration) {
  return {
    gt: (d2: Duration) => ms(d1) > ms(d2),
    lt: (d2: Duration) => ms(d1) < ms(d2),
    gte: (d2: Duration) => ms(d1) >= ms(d2),
    lte: (d2: Duration) => ms(d1) <= ms(d2),
    eq: (d2: Duration) => ms(d1) === ms(d2),
  };
}

export function requireDuration(value: unknown): Duration {
  if (!(typeof value === 'string') || !/^\d+[smhd]$/.test(value)) {
    throw new Error(`Invalid duration: ${value}`);
  }
  return value as Duration;
}
