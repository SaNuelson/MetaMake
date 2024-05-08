import MetaFormat from "./MetaFormat";
import MetaProperty, { Arity, Mandatory, StructuredMetaProperty } from "./MetaProperty";
import Restructurable from "./Restructurable";

export default class MetaModel extends Restructurable {
  metaFormat: MetaFormat;
  root: MetaDatum;

  constructor(metaFormat: MetaFormat);
  constructor(metaFormat: MetaFormat, metaData: MetaDatum);
  constructor(metaFormat: MetaFormat, metaData?: MetaDatum) {
    super();
    this.metaFormat = metaFormat;
    this.root = metaData ?? createMetaDatum(metaFormat.metaProps);
  }

  private walk(path: string): MetaDatum | MetaDatum[] {
    console.log('MetaModel.walk', path);

    const parsedPath = parsePath(path);

    let arity: Arity = Mandatory;
    let prop: MetaProperty = this.metaFormat.metaProps;
    let data: MetaDatum | MetaDatum[] = this.root;

    for (const step of parsedPath) {
      const isIndex = /^\d+$/.test(step);
      if (isIndex) {
        if (!Array.isArray(data)) {
          if (data instanceof StructuredMetaDatum)
            throw new Error(`INDEX OF STRUCT DATA: Expected property of ${data.name} (one of [${Object.keys(data.data)}]), got index ${step} instead.`);
          else
            throw new Error(`INDEX OF SCALAR DATA: Expected end of path, got index ${step} instead.`);
        }

        if (data.length <= +step) {
          throw new Error(`INDEX OUT OF RANGE: Expected index in range of ${data.length} for ${prop.name}, got ${step} instead.`);
        }

        // MetaDatum[] -> StructMetaDatum | PrimMetaDatum
        data = data[step];
      }
      // !isIndex
      else {
        if (Array.isArray(data)) {
          if (data.length > 1) {
            throw new Error(`PROP OF ARRAY DATA: Expected index for array of length ${data.length}, got property ${prop.name} instead.`);
          }
          if (arity.max === undefined || arity.max > 1) {
            throw new Error(`NO IMPLICIT FIRST: Expected index for array of length ${data.length}, got property ${prop.name} instead.`);
          }

          // Implicitly select single element
          data = data[0];
        }

        if (!(prop instanceof StructuredMetaProperty)) {
          throw new Error(`PROP OF SIMPLE PROP: Expected end of path, got property ${step} instead.`);
        }

        if (!(data instanceof StructuredMetaDatum)) {
          throw new Error(`BAD DATA: MetaDatum ${data.name} is unstructured, but underlying property ${prop.name} is structured.`);
        }

        const childProp = prop.children[step]?.property;
        if (!childProp) {
          throw new Error(`UNK PROP CHILD: Expected property of ${prop.name} (one of [${Object.keys(prop.children)}]), got ${step} instead.`);
        }

        arity = prop.children[step].arity;
        prop = childProp;
        data = data.data[step];
      }
    }

    return [arity, prop, data];
  }

  getValue(path: string): any | any[] {
    const [arity, prop, data] = this.walk(path);

    if (Array.isArray(data)) {
      if (data[0] instanceof StructuredMetaDatum) {
        throw new Error(`GET ARRAY STRUCT DATA: Cannot get list of structured property at ${path}.`);
      }

      // Implicit first
      if (data.length === 1 && arity.max === 1) {
        return (data[0] as PrimitiveMetaDatum<any>).value;
      }

      return data.map((pd: PrimitiveMetaDatum<any>) => pd.value);
    }
    else {
      if (data instanceof StructuredMetaDatum) {
        throw new Error(`GET SCALAR STRUCT DATA: Cannot get a structured property at ${path}.`);
      }

      return (data as PrimitiveMetaDatum<any>).value;
    }
  }

  setValue(path: string, value: any) {
    let [arity, prop, data] = this.walk(path);

    if (Array.isArray(data)) {
      // TODO: Only implicitly get first if mandatory or optional
      if (data.length > 1) {
        throw new Error(`Cannot set a list of properties at ${path}`);
      }
      data = data[0];
    }

    if (data instanceof StructuredMetaDatum) {
      throw new Error(`Cannot set a structured property at ${path}.`);
    }

    (data as PrimitiveMetaDatum<any>).value = value;
  }

  [Restructurable.from](obj: MetaModel) {
    return new MetaModel(obj.metaFormat, obj.root);
  }
}

// TODO: Make into type/interface to avoid unnecessary restructuring
export class MetaDatum extends Restructurable {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
export class PrimitiveMetaDatum<T extends number | string | boolean | Date> extends MetaDatum {
  value?: T;

  constructor(name: string, value?: T) {
    super(name);
    this.value = value;
  }
}
export class StructuredMetaDatum extends MetaDatum {
  data: {[name: string]: PrimitiveMetaDatum<any>[] | StructuredMetaDatum[]};

  constructor(name: string, data: {[name: string]: MetaDatum[]}) {
    super(name);
    this.data = data;
  }
}

// const pathNodePattern = /(\w+)|\[(\d+)]/g;
function parsePath(path: string) {
  // TODO: Validation and possibly fix regex

  return path.split(/[.\[\]]/g).filter(x=>x);
}

function createMetaDatum(property: MetaProperty): MetaDatum {
  if (property instanceof StructuredMetaProperty) {
    const values: {[p: string]: MetaDatum[]} = Object.fromEntries(
      Object.values(property.children).map(
        ({property}) => [property.name, [createMetaDatum(property)]]
      )
    );
    return new StructuredMetaDatum(property.name, values);
  }
  else {
    return new PrimitiveMetaDatum(property.name);
  }
}
