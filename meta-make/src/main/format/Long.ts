import MetaFormat from '../../common/dto/MetaFormat'
import Property, {
  StructuredProperty
} from '../../common/dto/Property.js'
import { MandatoryArity } from '../../common/dto/ArityBounds'

const Long = new MetaFormat(
  'Long',
  new StructuredProperty({
    name: 'Long',
    description: 'Long meta format',
    propertyDefinitions: [
      {
        arity: MandatoryArity,
        property: new Property({
          name: 'Title',
          description: 'Name of the dataset',
          type: 'string'
        })
      },
      {
        arity: MandatoryArity,
        property: new Property({
          name: 'Description',
          description: 'Short description about the contents of the dataset',
          type: 'string'
        })
      },
      {
        arity: { min: 3 },
        property: new Property({
          name: 'Keyword',
          description: 'Single-word keyword describing the content of the dataset',
          type: 'string'
        })
      },
      {
        arity: { min: 2 },
        property: new Property({
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
        property: new Property({
          name: 'Note',
          description: 'Custom note for the author',
          type: 'string'
        })
      },
      {
        arity: { min: 2 },
        property: new StructuredProperty({
          name: 'Topic',
          description: 'Single topic of the dataset',
          propertyDefinitions: [
            {
              arity: MandatoryArity,
              property: new Property({
                name: 'Name',
                description: 'Name of the topic',
                type: 'string'
              })
            },
            {
              arity: MandatoryArity,
              property: new Property({
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
