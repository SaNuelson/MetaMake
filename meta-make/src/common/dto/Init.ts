import Restructurable from './Restructurable'
import DataInfo from './DataInfo'
import { KnowledgeBase } from './KnowledgeBase'
import MetaFormat from './MetaFormat'
import MetaProperty, { StructuredMetaProperty } from './MetaProperty'

export default function () {
  Restructurable.addClass(DataInfo)
  Restructurable.addClass(KnowledgeBase)

  Restructurable.addClass(MetaFormat)

  Restructurable.addClass(MetaProperty)
  Restructurable.addClass(StructuredMetaProperty)
}
