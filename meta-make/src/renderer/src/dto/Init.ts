import Restructurable from '../../../common/dto/Restructurable'
import DataInfo from '../../../common/dto/DataInfo'
import { KnowledgeBase } from '../../../common/dto/KnowledgeBase'
import MetaFormat from '../../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../../common/dto/MetaProperty'
import MetaModel, { MetaDatum, PrimitiveMetaDatum, StructuredMetaDatum } from "../../../common/dto/MetaModel";

export default function () {
  Restructurable.addClass(DataInfo)
  Restructurable.addClass(KnowledgeBase)
  Restructurable.addClass(KnowledgeBase, 'KnowledgeBaseModel')

  Restructurable.addClass(MetaFormat)

  Restructurable.addClass(MetaProperty)
  Restructurable.addClass(StructuredMetaProperty)

  Restructurable.addClass(MetaModel)
  Restructurable.addClass(MetaDatum)
  Restructurable.addClass(PrimitiveMetaDatum)
  Restructurable.addClass(StructuredMetaDatum)
}
