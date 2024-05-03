import MetaFormat from '../../common/dto/MetaFormat'
import knowledgeBaseManager from '../kb/KnowledgeBaseManager'

export function chainJsonTransformers(
  breakOnChange: boolean = false,
  ...transformers: Array<(this: any, key: string, value: any) => any>
) {
  return function (this: any, key: string, value: any): any {
    let newValue: any
    for (const transformer of transformers) {
      newValue = transformer.call(this, key, value)
      if (breakOnChange && newValue !== value) {
        return newValue
      }
      value = newValue
    }
    return value
  }
}

export function metaObjectStripper(this: any, _: string, value: any): any {
  if (value instanceof MetaFormat) {
    return {
      __rebind: MetaFormat.name,
      name: value.name
    };
  }
  return value;
}

export function metaObjectReviver(this: any, _: string, value: any): any {
  if (typeof value === "object" && value.hasOwnProperty("__rebind")) {
    switch (value.__rebind) {
      case MetaFormat.name:
        console.log("Rebind", value, knowledgeBaseManager.getMetaFormat(value.name));
        return knowledgeBaseManager.getMetaFormat(value.name);
    }
  }
  return value;
}

export function dateTimeReviver(this: any, _: string, value: any): Date | any {
  let a
  if (typeof value === 'string') {
    // 2024-04-20T17:43:28.915Z
    a = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.exec(value)
    if (a) {
      return new Date(Date.parse(a))
    }
  }
  return value
}
