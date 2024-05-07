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
          throw new Error(`INDEX OF SCALAR DATA: Expected property of ${data.name}, got index ${step} instead.`);
        }

        if (data.length <= +step) {
          throw new Error(`INDEX OUT OF RANGE: Index ${step} out of range of property ${prop.name} with ${data.length} values.`);
        }

        // MetaDatum[] -> StructMetaDatum | PrimMetaDatum
        data = data[step];
      }
      // !isIndex
      else {
        if (Array.isArray(data)) {
          if (data.length > 1 || arity.max === undefined || arity.max > 1) {
            throw new Error(`PROP OF ARRAY DATA: Expected index for array of length ${data.length}, got property ${prop.name} instead.`);
          }

          // Implicitly select single element
          data = data[0];
        }

        if (!(prop instanceof StructuredMetaProperty)) {
          throw new Error(`PROP OF SIMPLE PROP: Expected end of path, got ${step} instead.`);
        }

        if (!(data instanceof StructuredMetaDatum)) {
          throw new Error(`PROP OF SIMPLE DATA: Expected property of ${data.name}, got ${prop.name} instead.`);
        }

        const childProp = prop.children[step]?.property;
        if (!childProp) {
          throw new Error(`UNK PROP CHILD: Expected property of ${prop.name}, got ${step}`);
        }

        arity = prop.children[step].arity;
        prop = childProp;
        data = data.data[step];
      }
    }

    return data;
  }

  getValue(path: string): any | any[] {
    const data = this.walk(path);

    if (Array.isArray(data)) {
      if (data[0] instanceof StructuredMetaDatum) {
        throw new Error(`GET ARRAY STRUCT DATA: Cannot get list of structured property at ${path}.`);
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
    let data = this.walk(path);

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

  return path.split(/[.\[\]]+/g);
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
