import { strict as assert } from 'assert'
import Restructurable from "../Restructurable";

describe("Restructurable class, when restructured", () => {

  class Integer extends Restructurable {
    public value: number;
    constructor(value: number) {
      super();
      this.value = value;
    }
    public negative(): number {
      return -this.value;
    }
  }
  Restructurable.addClass(Integer);

  it("should regain functionality", () => {
    const value: number = 25;

    const sourceInteger: Integer = new Integer(value);
    const clonedInteger: object = structuredClone(sourceInteger);
    const restructuredInteger: Integer = Restructurable.restructure(clonedInteger);

    assert.ok(restructuredInteger);
    assert.notEqual(restructuredInteger, sourceInteger);
    assert.ok(restructuredInteger.negative);
    assert.equal(restructuredInteger.negative(), -value);
  });

  class ArrayList extends Restructurable {
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
  Restructurable.addClass(ArrayList);

  it("should restructure any nested restructurables as well", () => {
    const list = new ArrayList([
      new ArrayList([
        new Integer(3),
        new Integer(5)
      ]),
      new Integer(15),
      75
    ]);
    const clonedList = structuredClone(list);
    const restructuredList = Restructurable.restructure(clonedList);

    assert.ok(restructuredList);
    assert.notEqual(restructuredList, list);

    assert.ok(restructuredList.items[0].reversed);
    assert.equal(restructuredList.items[0].items[0].negative(), -3);
  })

  interface Person {
    name: string;
    age: number;

    info(): string[];
  }

  class Student extends Restructurable implements Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
      super();
      this.name = name;
      this.age = age;
    }

    public info(): string[] {
      return ["student", this.name, `aged ${this.age}`];
    }

    public studiesFor(): number {
      return this.age - 18;
    }
  }

  class Professor extends Restructurable implements Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
      super();
      this.name = name;
      this.age = age;
    }

    public info(): string[] {
      return ["professor", this.name, `aged ${this.age}`];
    }

    public teachesUntil(): number {
      return 65 - this.age;
    }
  }
  Restructurable.addClass(Professor, Student.name);

  it("should restructure to target class instead of its own, if explicitly specified", () => {
    const student: Student = new Student("Jack Winslow", 25);
    const clone: object = structuredClone(student);
    const professor: Professor = Restructurable.restructure(clone);

    assert.ok(professor);
    assert.notEqual(professor, student);
    assert.equal(professor.name, student.name);
    assert.deepEqual(professor.info(), ["professor", ...student.info().slice(1)]);
    assert.ok(!(professor as unknown as Student).studiesFor);
    assert.ok(professor.teachesUntil);
    assert.equal(professor.teachesUntil(), 65 - (student.studiesFor() + 18));
  });

  class Square extends Restructurable {
    /* center-point and side length */
    cx: number;
    cy: number;
    a: number;
    constructor(cx: number, cy: number, a: number) {
      super();
      this.cx = cx;
      this.cy = cy;
      this.a = a;
    }

    public get area(): number {
      return this.a * this.a;
    }
  }

  class Polygon extends Restructurable {
    xs: number[];
    ys: number[];

    constructor(...coords: [number, number][]) {
      super();
      this.xs = coords.map(xy => xy[0]);
      this.ys = coords.map(xy => xy[1]);
    }

    public get bounds(): [number, number, number, number] {
      const l = Math.min(...this.xs);
      const t = Math.min(...this.ys);
      const r = Math.max(...this.xs);
      const b = Math.max(...this.ys);
      return [l, t, r, b];
    }

    [Restructurable.from](source: any) {
      if (!source.__className) {
        throw new Error(`${Polygon.name} unable to restructure from plain object.`);
      }
      if (source.__className === Square.name) {
        const l: number = source.cx - source.a/2;
        const r: number = source.cx + source.a/2;
        const t: number = source.cy - source.a/2;
        const b: number = source.cy + source.a/2;
        return new Polygon([l, t], [r, t], [r, b], [l, b]);
      }
      else {
        throw new Error(`${Polygon.name} unable to restructure from ${source.__className}`);
      }
    }
  }
  Restructurable.addClass(Polygon, Square.name);

  it("should restructure using specialized method, if set", () => {
    const square: Square = new Square(60, 80, 20);
    const clone: object = structuredClone(square);
    const polygon: Polygon = Restructurable.restructure(clone);

    assert.ok(polygon);
    assert.notEqual(polygon, square);
    assert.ok(!(polygon as unknown as Square).area);
    assert.deepEqual(polygon.bounds, [50, 70, 70, 90]);
  });

})
