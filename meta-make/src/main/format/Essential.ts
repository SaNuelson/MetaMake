import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'

const Essential = new MetaFormat(
  'Essential',
  new StructuredMetaProperty(
    "Essential",
    "Essential meta format",
    [
      new MetaProperty('Title', 'Name of the dataset', true, 'string'),
      new MetaProperty(
  'Description',
  'Short description about the contents of the dataset',
  true,
  'string'
      ),
      new StructuredMetaProperty('Author', 'Creator of the dataset', [
        new MetaProperty('Name', 'Name of the author', true, 'string'),
        new MetaProperty('Email', 'Contact email', false, 'string', 'email')
      ])
    ]
  ))

export default Essential;
