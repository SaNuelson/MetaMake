import MetaModel from "./MetaModel";


export default interface MetaModelSource {
  name: string,
  label: string
}

export type MetaBase = [MetaModel, MetaModelSource][]
