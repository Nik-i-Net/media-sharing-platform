export async function catchError<T>(
  promise: Promise<T>,
): Promise<[err: Error, result?: never] | [err: undefined, result: T]> {
  try {
    const result = await promise;
    return [undefined, result];
  } catch (err) {
    if (!(err instanceof Error)) throw err;
    return [err];
  }
}
