import Restructurable from '../../common/dto/Restructurable'
import DataInfo from '../../common/dto/DataInfo'
import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'
import KnowledgeBaseModel from "./KnowledgeBaseModel";
import MetaModel from "../../common/dto/MetaModel";

export default function () {
  Restructurable.addClass(DataInfo)

  Restructurable.addClass(KnowledgeBaseModel)

  Restructurable.addClass(MetaFormat)

  Restructurable.addClass(MetaProperty)
  Restructurable.addClass(StructuredMetaProperty)

  Restructurable.addClass(MetaModel)
}
