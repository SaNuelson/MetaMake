import { Target } from "electron-builder";

export default class Serializable<Source extends Object> {

  protected static __classDict: {[className: string]: typeof Serializable<any>} = {};
  public static addClass(clazz: typeof Serializable<any>, sourceName: string | null = null) {
    const name = sourceName ?? clazz.name;
    if (Serializable.__classDict.hasOwnProperty(name))
      return;
    Serializable.__classDict[name] = clazz;
  }

  // @ts-ignore
  private __className: string = this.constructor.name;

  constructor(serialized: Source) {
    Object.assign(this, serialized);
    for (const propName of Object.getOwnPropertyNames(this)) {
      this[propName] = Serializable.deserialize(this[propName]);
    }
  }

  public static deserialize(serialized: any): Serializable<any> | Object | any /*primitive*/ {
    console.log("Serializable.deserialize", serialized);

    // primitive, keep as is
    if (typeof serialized !== "object") {
      console.log("...deserialize primitive", typeof serialized);
      return serialized;
    }

    // serialized, deserialize via constructor
    if (serialized["__className"] !== undefined) {
      return new Serializable.__classDict[serialized.__className](serialized);
    }

    // JS built-in, may contain serialized items
    for (const [key, val] of Object.entries(serialized)) {
      console.log("...deserialize builtin");
      serialized[key] = Serializable.deserialize(val);
    }
    return serialized;
  }
}

class Integer extends Serializable<Integer> {
  public value: number;

  constructor(serialized: Integer) {
    console.log(`Integer.constructor(${JSON.stringify(serialized)})`);
    super(serialized);
    this.value ??= -999;
  }
}
Serializable.addClass(Integer);

const integer = new Integer({value: 5} as Integer);
console.log(integer);
console.log(integer.value);

class ArrayList extends Serializable<ArrayList> {
  public items: Serializable<any>[];
  constructor(serialized: ArrayList) {
    console.log(`ArrayList.constructor(${JSON.stringify(serialized)})`);
    super(serialized);
    this.items ??= [];
  }
}
Serializable.addClass(ArrayList);

const list = new ArrayList(
  {
    __className: "ArrayList",
    items: [
      {value: 10, __className: "Integer"},
      {value: 20, __className: "Integer"}
    ]
  } as unknown as ArrayList);
console.log(list);
console.log(list.items);
console.log(list.items[0])

interface Person {
  name: string;
  age: number;

  greet(): string;
}

class SourcePerson extends Serializable<SourcePerson> implements Person {
  age: number;
  name: string;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public greet(): string {
    return `SourcePerson(${this.name}, ${this.age})`;
  }
}

class TargetPerson extends Serializable<SourcePerson> implements Person {
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
