export function assertDefined<T>(value: T, errorMessage?: string): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(errorMessage ?? 'Value is not defined');
  }
}

export function ensureDefined<T>(value: T, errorMessage?: string): NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(errorMessage ?? 'Value is not defined');
  }
  return value as NonNullable<T>;
}
