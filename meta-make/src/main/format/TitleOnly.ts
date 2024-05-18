import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'
import { MandatoryArity } from '../../common/dto/ArityBounds'

const TitleOnly = new MetaFormat(
  'TitleOnly',
  new StructuredMetaProperty({
    name: 'TitleOnly',
    description: 'TitleOnly meta format',
    children: [
      {
        arity: MandatoryArity,
        property: new MetaProperty({
          name: 'Title',
          description: 'Name of the dataset',
          type: 'string'
        })
      }
    ]
  })
)

export default TitleOnly
