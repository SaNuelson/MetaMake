import MetaModel from "./MetaModel";
import MetaFormat from "./MetaFormat";


export default interface MetaModelSource {
  name: string,
  label: string
}

export type MetaBase = {
  format: MetaFormat,
  models: [MetaModel, MetaModelSource][]
}
