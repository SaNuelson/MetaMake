import MetaFormat from '../../../common/dto/MetaFormat.js'
import Property, { StructuredProperty } from '../../../common/dto/Property.js'

const TitleOnly = new MetaFormat(
  'TitleOnly',
  new StructuredProperty({
    name: 'TitleOnly',
    description: 'TitleOnly meta format',
    propertyDefinitions: [
      {
        mandatory: true,
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
