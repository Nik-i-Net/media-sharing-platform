export function assertDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined) throw new Error('Value is not defined');
}
