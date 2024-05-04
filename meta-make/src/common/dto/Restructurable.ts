
const debug = false;
export default class Restructurable {
  constructor(..._: any[]) {}

  protected static __classDict: { [className: string]: typeof Restructurable } = {}

  public static addClass(clazz: typeof Restructurable, sourceName: string | null = null): boolean {
    const name = sourceName ?? clazz.name
    if (Restructurable.__classDict.hasOwnProperty(name))
      return false
    Restructurable.__classDict[name] = clazz
    return true
  }

  // @ts-ignore
  private __className: string = this.constructor.name

  public static readonly from: symbol = Symbol('restructureFrom')

  public static restructure(obj: any): Restructurable | Object | any {
    if (debug)
      console.groupCollapsed(`${Restructurable.name}.${Restructurable.restructure.name}`, obj)
    const restructured = Restructurable.__restructure(obj);
    if (debug)
      console.log(`${Restructurable.name}.${Restructurable.restructure.name} end as`, restructured);
    if(debug)
      console.groupEnd()
    return restructured;
  }

  private static __restructure(obj: any): Restructurable | Object | any /*primitive*/ {
    // primitive, keep as is
    if (typeof obj !== 'object') {
      if (debug)
        console.log('...restructure primitive of type', typeof obj)
      return obj
    }

    // restructurable, use constructor
    if (obj['__className'] !== undefined) {
      if (!Restructurable.__classDict[obj.__className]) {
        console.error(`Restructurable encountered an unknown potential restructurable ${obj.__className}.`);
        console.groupCollapsed(`${obj.__className} dump:`);
        console.log(JSON.stringify(obj));
        console.groupEnd();
      }
      else {
        let Clazz = Restructurable.__classDict[obj.__className]

        if (debug)
          console.log('...restructure recursively')
        for (const key of Object.keys(obj)) {
          if (debug)
            console.log(`    ...for key ${key}`)
          obj[key] = Restructurable.restructure(obj[key])
        }

        // custom restructuring process
        if (Restructurable.from in Clazz.prototype) {
          if (debug)
            console.log('...restructure via custom method')
          let restructured: Restructurable = Clazz.prototype[Restructurable.from](obj)
          if (restructured) {
            return restructured
          }
          if (debug)
            console.log('    ...which failed (possibly by design).')
        }

        if (debug)
          console.log('...restructure via empty ctor and obj assign')
        let restructured = new Clazz()
        Object.assign(restructured, obj)

        return restructured
      }
    }

    if (debug)
      console.log('...restructure built-in')
    // JS built-in, may contain serialized items
    for (const [key, val] of Object.entries(obj)) {
      if (debug)
        console.log(`    ...for key ${key}`)
      obj[key] = Restructurable.restructure(val)
    }
    return obj
  }
}
