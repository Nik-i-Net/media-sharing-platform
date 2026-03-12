import { BaseError } from '../../core/errors/base.error';

const POSTGRES_ERROR_CODES = {
  // NOT_NULL_VIOLATION: '23502',
  // FOREIGN_KEY_VIOLATION: '23503',
  UNIQUE_VIOLATION: '23505',
};

function formatFieldName(name: string) {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  return name.toLowerCase().split('_').map(capitalize).join(' ');
}

type PostgresError = Error & {
  code: string;
  detail: string;
};

function isDatabaseError(err: unknown): err is PostgresError {
  return (
    !(err instanceof BaseError) &&
    err instanceof Error &&
    'code' in err &&
    typeof err.code === 'string' &&
    'detail' in err &&
    typeof err.detail === 'string'
  );
}

function mapDatabaseError(err: PostgresError) {
  if (err.code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
    const field = (err.detail.match(/^Key \((\w+)\)=/) || [])[1];
    if (!field) return err;
    // return new AlreadyExistsException(formatFieldName(field));
    // TODO:
    return new Error(formatFieldName(field));
  }

  return err;
}

export { isDatabaseError, mapDatabaseError };
