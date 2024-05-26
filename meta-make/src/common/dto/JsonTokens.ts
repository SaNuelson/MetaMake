type JsonSimpleToken = {
  name: 'startObject' | 'endObject' | 'startArray' | 'endArray';
}
type JsonValueToken = {
  name: 'keyValue' | 'stringValue' | 'numberValue' | 'nullValue' | 'trueValue' | 'falseValue';
  value: string;
}
export type JsonToken = JsonSimpleToken | JsonValueToken;
