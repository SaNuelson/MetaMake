import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'

const Basic = new MetaFormat(
  'Basic',
  new StructuredMetaProperty(1000, 'Basic', 'Basic meta format', [
    new MetaProperty(1001, 'Title', 'Name of the dataset', 'string'),
    new MetaProperty(1002, 'Description', 'Short description about the contents of the dataset', 'string')
  ])
)

export default Basic;
