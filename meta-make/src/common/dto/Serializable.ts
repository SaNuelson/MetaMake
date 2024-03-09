export default class Serializable {

  constructor(..._: any[]) { }

  protected static __classDict: {[className: string]: typeof Serializable} = {};
  public static addClass(clazz: typeof Serializable, sourceName: string | null = null) {
    const name = sourceName ?? clazz.name;
    if (Serializable.__classDict.hasOwnProperty(name))
      return;
    Serializable.__classDict[name] = clazz;
  }

  // @ts-ignore
  private __className: string = this.constructor.name;

  public static deserialize(serialized: any): Serializable | Object | any /*primitive*/ {
    console.log("Serializable.deserialize", serialized);

    // primitive, keep as is
    if (typeof serialized !== "object") {
      console.log("...deserialize primitive", typeof serialized);
      return serialized;
    }

    // serialized, deserialize via constructor
    if (serialized["__className"] !== undefined) {
      let desereliazed = new Serializable.__classDict[serialized.__className]();
      Object.assign(desereliazed, serialized);
      for (const key of Object.keys(desereliazed)) {
        desereliazed[key] = Serializable.deserialize(desereliazed[key]);
      }
      return desereliazed;
    }

    // JS built-in, may contain serialized items
    for (const [key, val] of Object.entries(serialized)) {
      console.log("...deserialize builtin");
      serialized[key] = Serializable.deserialize(val);
    }
    return serialized;
  }
}

class Integer extends Serializable {
  public value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
  public negative(): number {
    return -this.value;
  }
}
Serializable.addClass(Integer);

const sourceInteger = new Integer(25);
const serializedInteger = structuredClone(sourceInteger);
const deserializedInteger = Serializable.deserialize(serializedInteger);
console.log(deserializedInteger);
console.log(deserializedInteger.negative());

class ArrayList extends Serializable {
  public items: any[];
  constructor(items: any[]) {
    super();
    this.items = items ?? [];
  }
  public reversed(): any[] {
    let copy = [...this.items];
    return copy.reverse();
  }
}
Serializable.addClass(ArrayList);

const list = new ArrayList([
  new Integer(5),
  new Integer(25),
  125
]);
const serializedList = structuredClone(list);
const deserializedList = Serializable.deserialize(serializedList);
console.log(deserializedList);
console.log(deserializedList.reversed())
console.log(deserializedList.items[0].negative());

interface Person {
  name: string;
  age: number;

  greet(): string;
}

class SourcePerson extends Serializable implements Person {
  age: number;
  name: string;

  constructor(name: string, age: number) {
    super();
    this.name = name;
    this.age = age;
  }

  public greet(): string {
    return `SourcePerson(${this.name}, ${this.age})`;
  }
}

class TargetPerson extends Serializable implements Person {
  age: number;
  name: string;

  constructor(person: SourcePerson) {
    super(person);
    this.name ??= "Unset";
    this.age ??= -1;
  }

  public greet(): string {
    return `TargetPerson(${this.name}, ${this.age})`;
  }

  public targetGreet(): string {
    return `Definitely TargetPerson(${this.name}, ${this.age})`;
  }
}
Serializable.addClass(TargetPerson, SourcePerson.name);

const person: SourcePerson = new SourcePerson("John", 20);
console.log(person.greet());
const serializedPerson = structuredClone(person);
console.log(serializedPerson.greet === undefined);
const deserializedPerson = Serializable.deserialize(serializedPerson);
console.log(deserializedPerson.greet());

const sourcePerson: SourcePerson = new SourcePerson("John", 15);
console.log(sourcePerson.greet());
const somePerson: Person = new SourcePerson("Jack", 20);
console.log(somePerson.greet());

const targetPerson: TargetPerson = new TargetPerson(sourcePerson);
console.log(targetPerson.greet());
console.log(targetPerson.targetGreet());
const thatPerson: Person = new TargetPerson(somePerson as SourcePerson);
console.log(thatPerson.greet());
console.log((thatPerson as TargetPerson).targetGreet());

const anotherPerson: SourcePerson = new SourcePerson("Jill", 25);
console.log(anotherPerson);
const copiedPerson = structuredClone(anotherPerson);
const samePerson: TargetPerson = Serializable.deserialize(copiedPerson);
console.log(samePerson);
console.log(samePerson.targetGreet());
