import { ConflictError } from '@common/errors/http.errors.js';

const POSTGRES_ERROR_CODES = {
  // NOT_NULL_VIOLATION: '23502',
  // FOREIGN_KEY_VIOLATION: '23503',
  UNIQUE_VIOLATION: '23505',
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatFieldName(name: string) {
  return name.toLowerCase().split('_').map(capitalize).join(' ');
}

type PgError = Error & {
  code: string;
  detail: string;
};

function isPgError(err: unknown): err is PgError {
  return (
    err instanceof Error &&
    'code' in err &&
    typeof err.code === 'string' &&
    'detail' in err &&
    typeof err.detail === 'string'
  );
}

function mapPgError(err: PgError) {
  if (err.code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
    const field = (err.detail.match(/^Key \((\w+)\)=/) || [])[1];
    if (!field) return err;
    return new ConflictError(`${formatFieldName(field)} already taken`);
  }

  return err;
}

export { isPgError, mapPgError };
