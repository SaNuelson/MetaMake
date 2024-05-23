import Restructurable from '../../common/dto/Restructurable'
import DataInfo from '../../common/dto/DataInfo'
import MetaFormat from '../../common/dto/MetaFormat'
import Property, { StructuredProperty } from "../../common/dto/Property.js";
import KnowledgeBaseModel from "./KnowledgeBaseModel";
import MetaModel, { MetaDatum, PrimitiveMetaDatum, StructuredMetaDatum } from "../../common/dto/MetaModel";

export default  function () {
  Restructurable.addClass(DataInfo)

  Restructurable.addClass(KnowledgeBaseModel, 'KnowledgeBase')
  Restructurable.addClass(KnowledgeBaseModel)

  Restructurable.addClass(MetaFormat)

  Restructurable.addClass(Property)
  Restructurable.addClass(StructuredProperty)

  Restructurable.addClass(MetaModel)
  Restructurable.addClass(MetaDatum)
  Restructurable.addClass(PrimitiveMetaDatum)
  Restructurable.addClass(StructuredMetaDatum)
}
