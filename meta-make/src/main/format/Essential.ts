import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'

const Essential = new MetaFormat(
  'Essential',
  new StructuredMetaProperty(
    "Essential",
    "Essential meta format",
    [
      new MetaProperty('Title', 'Name of the dataset', 'string'),
      new MetaProperty(
  'Description',
  'Short description about the contents of the dataset',
  'string'
      ),
      new StructuredMetaProperty('Author', 'Creator of the dataset', [
        new MetaProperty('Name', 'Name of the author', 'string'),
        new MetaProperty('Email', 'Contact email', 'email')
      ])
    ]
  ))

export default Essential;
