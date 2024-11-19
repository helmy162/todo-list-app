export function checkType<T>(type: Record<string, T>, value: T): boolean {
  return Object.values(type).includes(value);
}
