import assert from 'assert';

export async function safe<T>(
  promise: Promise<T>,
): Promise<[err: Error, result?: never] | [err: undefined, result: T]> {
  try {
    const result = await promise;
    return [undefined, result];
  } catch (err) {
    assert(err instanceof Error);
    return [err];
  }
}
