import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { Mandatory, StructuredMetaProperty } from '../../common/dto/MetaProperty'

const Essential = new MetaFormat(
  'Essential',
  new StructuredMetaProperty('Essential', 'Essential meta format', [
    {
      arity: Mandatory,
      property: new MetaProperty('Title', 'Name of the dataset', 'string')
    },
    {
      arity: Mandatory,
      property: new MetaProperty(
        'Description',
        'Short description about the contents of the dataset',
        'string'
      )
    },
    {
      arity: Mandatory,
      property: new StructuredMetaProperty('Author', 'Creator of the dataset',
        [
          {
            arity: Mandatory,
            property: new MetaProperty('Name', 'Name of the author', 'string'),
          },
          {
            arity: Mandatory,
            property: new MetaProperty('Email', 'Contact email', 'string', 'email')
          },
      ])
    }
  ])
)

export default Essential
