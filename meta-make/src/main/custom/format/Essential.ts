import MetaFormat from '../../../common/dto/MetaFormat.js'
import Property, { StructuredProperty } from '../../../common/dto/Property.js'
import { MandatoryArity } from '../../../common/dto/ArityBounds.js'

const Essential = new MetaFormat(
  'Essential',
  new StructuredProperty({
    name: 'Essential',
    description: 'Essential meta format',
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
        arity: MandatoryArity,
        property: new StructuredProperty({
          name: 'Author',
          description: 'Creator of the dataset',
          propertyDefinitions: [
            {
              arity: MandatoryArity,
              property: new Property({
                name: 'Name',
                description: 'Name of the author',
                type: 'string'
              })
            },
            {
              arity: MandatoryArity,
              property: new Property({
                name: 'Email',
                description: 'Contact email',
                type: 'string'
              })
            }
          ]
        })
      }
    ]
  })
)

export default Essential
