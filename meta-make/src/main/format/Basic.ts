import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'
import { MandatoryArity } from '../../common/dto/ArityBounds'

const Basic = new MetaFormat(
  'Basic',
  new StructuredMetaProperty({
    name: 'Basic',
    description: 'Basic meta format',
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
      }
    ]
  })
)

export default Basic
