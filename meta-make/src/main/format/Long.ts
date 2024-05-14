import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { EnumMetaProperty, StructuredMetaProperty } from "../../common/dto/MetaProperty";
import { MandatoryArity } from "../../common/dto/ArityBounds";

const Long = new MetaFormat(
  'Long',
  new StructuredMetaProperty('Long', 'Long meta format', [
    {
      arity: MandatoryArity,
      property: new MetaProperty('Title', 'Name of the dataset', 'string')
    },
    {
      arity: MandatoryArity,
      property: new MetaProperty(
        'Description',
        'Short description about the contents of the dataset',
        'string'
      )
    },
    {
      arity: { min: 3 },
      property: new MetaProperty(
        'Keyword',
        'Single-word keyword describing the content of the dataset',
        'string'
      )
    },
    {
      arity: { min: 2 },
      property: new EnumMetaProperty<string>(
        'Tag',
        'Sinle-word tag describing the content of the dataset from a fixed set of values',
        ['simple', 'average', 'detailed', 'public', 'confidential', 'local', 'national'],
        'string'
      )
    },
    {
      arity: MandatoryArity,
      property: new MetaProperty(
        'Note',
        'Custom note for the author',
        'string'
      )
    },
    {
      arity: { min: 2 },
      property: new StructuredMetaProperty('Topic', 'Single topic of the dataset', [
        {
          arity: MandatoryArity,
          property: new MetaProperty('Name', 'Name of the topic', 'string')
        },
        {
          arity: MandatoryArity,
          property: new MetaProperty('Description', 'Description of the topic', 'string')
        }
      ])
    }
  ])
)

export default Long
