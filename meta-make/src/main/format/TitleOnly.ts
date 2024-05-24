import MetaFormat from '../../common/dto/MetaFormat'
import Property, { StructuredProperty } from '../../common/dto/Property.js'
import { MandatoryArity } from '../../common/dto/ArityBounds'

const TitleOnly = new MetaFormat(
  'TitleOnly',
  new StructuredProperty({
    name: 'TitleOnly',
    description: 'TitleOnly meta format',
    propertyDefinitions: [
      {
        arity: MandatoryArity,
        property: new Property({
          name: 'Title',
          description: 'Name of the dataset',
          type: 'string'
        })
      }
    ]
  })
)

export default TitleOnly
