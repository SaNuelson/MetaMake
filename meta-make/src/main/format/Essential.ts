import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'

const Essential = new MetaFormat(
  'Essential',
  new StructuredMetaProperty(
    2001,
    "Essential",
    "Essential meta format",
    [
      new MetaProperty(2002, 'Title', 'Name of the dataset', 'string'),
      new MetaProperty(
        2003,
  'Description',
  'Short description about the contents of the dataset',
  'string'
      ),
      new StructuredMetaProperty(2004, 'Author', 'Creator of the dataset', [
        new MetaProperty(2005, 'Name', 'Name of the author', 'string'),
        new MetaProperty(2006, 'Email', 'Contact email', 'email')
      ])
    ]
  ))

export default Essential;
