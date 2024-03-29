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

  public static restructure(obj: any): Restructurable | Object | any /*primitive*/ {
    console.log(`${Restructurable.name}.${Restructurable.restructure.name}`, obj)
    console.log(`.. known restructurables: ${Object.keys(this.__classDict)}`)

    // primitive, keep as is
    if (typeof obj !== 'object') {
      console.log('...restructure primitive of type', typeof obj)
      return obj
    }

    // restructurable, use constructor
    if (obj['__className'] !== undefined) {
      let Clazz = Restructurable.__classDict[obj.__className]

      // custom restructuring process
      if (Restructurable.from in Clazz.prototype) {
        console.log('...restructure via custom method')
        let restructured: Restructurable = Clazz.prototype[Restructurable.from](obj)
        if (restructured) {
          return restructured
        }
        console.log('......which failed (possibly by design).')
      }

      console.log('...restructure recursively')
      let restructured = new Clazz()
      Object.assign(restructured, obj)
      for (const key of Object.keys(restructured)) {
        restructured[key] = Restructurable.restructure(restructured[key])
      }
      return restructured
    }

    // JS built-in, may contain serialized items
    for (const [key, val] of Object.entries(obj)) {
      console.log('...restructure built-in')
      obj[key] = Restructurable.restructure(val)
    }
    return obj
  }
}
