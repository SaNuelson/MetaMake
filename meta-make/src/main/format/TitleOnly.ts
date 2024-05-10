import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { MandatoryArity, StructuredMetaProperty } from "../../common/dto/MetaProperty";

const TitleOnly = new MetaFormat(
  'TitleOnly',
  new StructuredMetaProperty('TitleOnly', 'TitleOnly meta format', [
    {arity: MandatoryArity, property: new MetaProperty('Title', 'Name of the dataset', 'string')}
  ])
)

export default TitleOnly;
