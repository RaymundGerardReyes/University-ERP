/**
 * Normalizes any backend response or unknown value into a guaranteed JavaScript array.
 * Defensively handles common backend wrapper formats (e.g. { data: [...] }, { items: [...] },
 * { results: [...] }, { records: [...] }, { list: [...] }, { content: [...] }) as well as
 * null, undefined, primitive errors, or unexpected non-array objects.
 */
export function toSafeArray<T = any>(val: unknown): T[] {
  if (Array.isArray(val)) {
    return val as T[];
  }
  if (val && typeof val === 'object') {
    const obj = val as Record<string, any>;
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.results)) return obj.results as T[];
    if (Array.isArray(obj.records)) return obj.records as T[];
    if (Array.isArray(obj.values)) return obj.values as T[];
    if (Array.isArray(obj.list)) return obj.list as T[];
    if (Array.isArray(obj.content)) return obj.content as T[];
  }
  return [];
}

