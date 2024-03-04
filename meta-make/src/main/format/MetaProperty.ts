export default class MetaProperty {

  readonly name: string;
  readonly description: string;
  readonly type: string;

  constructor(name: string, description: string, type: string) {
    this.name = name;
    this.description = description;
    this.type = type;
  }

}

export class StructuredMetaProperty extends MetaProperty{
  readonly children: MetaProperty[];

  constructor(name: string, description: string, children: MetaProperty[]) {
    super(name, description, "object");
    this.children = children;
  }
}
