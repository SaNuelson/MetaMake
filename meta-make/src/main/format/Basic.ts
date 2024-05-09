import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { MandatoryArity, StructuredMetaProperty } from "../../common/dto/MetaProperty";

const Basic = new MetaFormat(
  'Basic',
  new StructuredMetaProperty('Basic', 'Basic meta format', [
    {arity: MandatoryArity, property: new MetaProperty('Title', 'Name of the dataset', 'string')},
    {arity: MandatoryArity, property: new MetaProperty('Description', 'Short description about the contents of the dataset', 'string')}
  ])
)

export default Basic;
