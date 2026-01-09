export function expectOne<T>(items: readonly T[], context?: string): T {
  if (items.length !== 1) {
    let message = `Expected 1 item, got ${items.length}`;
    if (context) {
      message = `[${context}] ${message}`;
    }
    throw new Error(message);
  }
  return items[0]!;
}
