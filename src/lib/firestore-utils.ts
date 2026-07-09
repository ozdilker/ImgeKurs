export function sanitizeForFirestore<T>(value: T): T {
  if (value === undefined) {
    return value;
  }

  if (value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item)) as T;
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      if (nestedValue !== undefined) {
        result[key] = sanitizeForFirestore(nestedValue);
      }
    }
    return result as T;
  }

  return value;
}
