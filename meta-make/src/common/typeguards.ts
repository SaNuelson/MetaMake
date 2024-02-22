export function isURL(object: unknown): object is URL {
  return object instanceof URL;
}
