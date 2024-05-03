import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'

const Long = new MetaFormat(
  'Long',
  new StructuredMetaProperty('Long', 'Long meta format', [
    new MetaProperty('Title', 'Name of the dataset', 'string'),
    new MetaProperty(
      'Description',
      'Short description about the contents of the dataset',
      'string'
    ),
    new StructuredMetaProperty('Topic', 'Single topic of the dataset', [
      new MetaProperty('Name', 'Name of the topic', 'string'),
      new MetaProperty('Description', 'Description of the topic', 'string')
    ])
  ])
)

export default Long;
