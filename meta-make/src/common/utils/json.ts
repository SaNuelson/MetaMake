export function dateTimeReviver(_: string, value: any): Date | any {
  let a;
  if (typeof value === 'string') {
    // 2024-04-20T17:43:28.915Z
    a = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.exec(value);
    if (a) {
      return new Date(Date.parse(a));
    }
  }
  return value;
}
