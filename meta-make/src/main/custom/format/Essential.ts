import MetaFormat from '../../../common/dto/MetaFormat.js'
import Property, { StructuredProperty } from '../../../common/dto/Property.js'

const Essential = new MetaFormat(
  'Essential',
  new StructuredProperty({
    name: 'Essential',
    description: 'Essential meta format',
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
      },
      {
        mandatory: true,
        property: new StructuredProperty({
          name: 'Author',
          description: 'Creator of the dataset',
          propertyDefinitions: [
            {
              mandatory: true,
              property: new Property({
                name: 'Name',
                description: 'Name of the author',
                type: 'string'
              })
            },
            {
              mandatory: true,
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
