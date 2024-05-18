import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, {
  StructuredMetaProperty
} from '../../common/dto/MetaProperty'
import { MandatoryArity } from '../../common/dto/ArityBounds'

const Long = new MetaFormat(
  'Long',
  new StructuredMetaProperty({
    name: 'Long',
    description: 'Long meta format',
    children: [
      {
        arity: MandatoryArity,
        property: new MetaProperty({
          name: 'Title',
          description: 'Name of the dataset',
          type: 'string'
        })
      },
      {
        arity: MandatoryArity,
        property: new MetaProperty({
          name: 'Description',
          description: 'Short description about the contents of the dataset',
          type: 'string'
        })
      },
      {
        arity: { min: 3 },
        property: new MetaProperty({
          name: 'Keyword',
          description: 'Single-word keyword describing the content of the dataset',
          type: 'string'
        })
      },
      {
        arity: { min: 2 },
        property: new MetaProperty({
          name: 'Tag',
          description:
            'Sinle-word tag describing the content of the dataset from a fixed set of values',
          domain: ['simple', 'average', 'detailed', 'public', 'confidential', 'local', 'national'],
          isDomainStrict: true,
          type: 'string'
        })
      },
      {
        arity: MandatoryArity,
        property: new MetaProperty({
          name: 'Note',
          description: 'Custom note for the author',
          type: 'string'
        })
      },
      {
        arity: { min: 2 },
        property: new StructuredMetaProperty({
          name: 'Topic',
          description: 'Single topic of the dataset',
          children: [
            {
              arity: MandatoryArity,
              property: new MetaProperty({
                name: 'Name',
                description: 'Name of the topic',
                type: 'string'
              })
            },
            {
              arity: MandatoryArity,
              property: new MetaProperty({
                name: 'Description',
                description: 'Description of the topic',
                type: 'string'
              })
            }
          ]
        })
      }
    ]
  })
)

export default Long
