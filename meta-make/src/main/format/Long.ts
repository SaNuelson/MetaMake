import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'

const Long = new MetaFormat(
  'Long',
  new StructuredMetaProperty(3001, 'Long', 'Long meta format', [
    new MetaProperty(3002, 'Title', 'Name of the dataset', 'string'),
    new MetaProperty(
      3003,
      'Description',
      'Short description about the contents of the dataset',
      'string'
    ),
    new StructuredMetaProperty(3004, 'Topic', 'Single topic of the dataset', [
      new MetaProperty(3005, 'Name', 'Name of the topic', 'string'),
      new MetaProperty(3006, 'Description', 'Description of the topic', 'string')
    ])
  ])
)

export default Long;
