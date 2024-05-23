import MetaFormat from '../../common/dto/MetaFormat'
import Property, { StructuredProperty } from '../../common/dto/Property.js'
import { MandatoryArity } from '../../common/dto/ArityBounds'

const Basic = new MetaFormat(
  'Basic',
  new StructuredProperty({
    name: 'Basic',
    description: 'Basic meta format',
    children: [
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
      }
    ]
  })
)

export default Basic
