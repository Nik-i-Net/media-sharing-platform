/**
 * Returns SQL to attach the `set_updated_at` trigger to a table.
 * @param {string} tableName - Name of the table
 * @returns {string} SQL query
 */
export function generateUpdatedAtTriggerSql(tableName: string): string {
  const triggerName = `trigger_${tableName}_updated_at`;
  return `
    CREATE TRIGGER ${triggerName}
    BEFORE UPDATE ON ${tableName}
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `;
}
