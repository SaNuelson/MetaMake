import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { Mandatory, StructuredMetaProperty } from "../../common/dto/MetaProperty";

const Basic = new MetaFormat(
  'Basic',
  new StructuredMetaProperty('Basic', 'Basic meta format', [
    {arity: Mandatory, property: new MetaProperty('Title', 'Name of the dataset', 'string')},
    {arity: Mandatory, property: new MetaProperty('Description', 'Short description about the contents of the dataset', 'string')}
  ])
)

export default Basic;
