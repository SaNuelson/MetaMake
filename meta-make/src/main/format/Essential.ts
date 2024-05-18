import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'
import { MandatoryArity } from '../../common/dto/ArityBounds'

const Essential = new MetaFormat(
  'Essential',
  new StructuredMetaProperty({
    name: 'Essential',
    description: 'Essential meta format',
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
        arity: MandatoryArity,
        property: new StructuredMetaProperty({
          name: 'Author',
          description: 'Creator of the dataset',
          children: [
            {
              arity: MandatoryArity,
              property: new MetaProperty({
                name: 'Name',
                description: 'Name of the author',
                type: 'string'
              })
            },
            {
              arity: MandatoryArity,
              property: new MetaProperty({
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
