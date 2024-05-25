type JsonSimpleToken = {
  name: string;
}
type JsonValueToken = {
  name: string;
  value: string;
}
export type JsonToken = JsonSimpleToken | JsonValueToken;
