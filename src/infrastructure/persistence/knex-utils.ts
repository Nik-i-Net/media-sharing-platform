/* eslint-disable @typescript-eslint/no-explicit-any */

// Outgoing: camelCase -> snake_case
export function wrapIdentifier(
  value: string,
  origImpl: (value: string) => string,
  _queryContext: any,
) {
  const snakeCaseValue = value.replace(/[A-Z]/g, (match, offset) => {
    return (offset > 0 ? '_' : '') + match.toLowerCase();
  });
  return origImpl(snakeCaseValue);
}

// Incoming: snake_case -> camelCase
export function postProcessResponse(result: any, _queryContext: any) {
  function convertToCamel(row: unknown) {
    if (row === null || typeof row !== 'object' || row.constructor !== Object) {
      return row;
    }

    const newRow: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const camelKey = key.replace(/_([a-z])/g, (_, match) => match.toUpperCase());
      newRow[camelKey] = convertToCamel(value);
    }

    return newRow;
  }

  if (result === null || typeof result !== 'object') return result;

  // Postgres-specific raw results  TODO: test it
  if (result.rows) {
    return result.rows.map((row: unknown) => convertToCamel(row));
  }

  if (Array.isArray(result)) {
    return result.map((row) => convertToCamel(row));
  }

  return convertToCamel(result);
}
