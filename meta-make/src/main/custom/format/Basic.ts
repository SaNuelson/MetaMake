import MetaFormat from '../../../common/dto/MetaFormat'
import Property, { StructuredProperty } from '../../../common/dto/Property'

const Basic = new MetaFormat(
  'Basic',
  new StructuredProperty({
    name: 'Basic',
    description: 'Basic meta format',
    propertyDefinitions: [
      {
        mandatory: true,
        property: new Property({
          name: 'Title',
          description: 'Name of the dataset',
          type: 'string'
        })
      },
      {
        mandatory: true,
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
