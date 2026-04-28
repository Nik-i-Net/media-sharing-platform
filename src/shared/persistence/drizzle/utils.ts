import { sql, type AnyColumn } from 'drizzle-orm';

export function excluded(col: AnyColumn) {
  return sql.raw(`excluded.${col.name}`);
}
