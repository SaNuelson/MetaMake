import Restructurable from '../../../common/dto/Restructurable'
import { CsvDataInfo, JsonDataInfo } from '../../../common/dto/DataInfo'
import { KnowledgeBase } from '../../../common/dto/KnowledgeBase'
import MetaFormat from '../../../common/dto/MetaFormat'
import Property, { ListProperty, StructuredProperty } from '../../../common/dto/Property.js'
import MetaModel from "../../../common/dto/MetaModel";

export default function () {
  Restructurable.addClass(CsvDataInfo)
  Restructurable.addClass(JsonDataInfo)

  Restructurable.addClass(KnowledgeBase)
  Restructurable.addClass(KnowledgeBase, 'KnowledgeBaseModel')

  Restructurable.addClass(MetaFormat)

  Restructurable.addClass(Property)
  Restructurable.addClass(ListProperty)
  Restructurable.addClass(StructuredProperty)

  Restructurable.addClass(MetaModel)
}
