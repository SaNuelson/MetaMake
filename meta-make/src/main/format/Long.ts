import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { Mandatory, StructuredMetaProperty } from '../../common/dto/MetaProperty'

const Long = new MetaFormat(
  'Long',
  new StructuredMetaProperty('Long', 'Long meta format', [
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
      property: new StructuredMetaProperty('Topic', 'Single topic of the dataset', [
        {
          arity: Mandatory,
          property: new MetaProperty('Name', 'Name of the topic', 'string')
        },
        {
          arity: Mandatory,
          property: new MetaProperty('Description', 'Description of the topic', 'string')
        }
      ])
    }
  ])
)

export default Long
