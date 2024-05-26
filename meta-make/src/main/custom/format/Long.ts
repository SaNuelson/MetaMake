import MetaFormat from '../../../common/dto/MetaFormat.js'
import Property, { ListProperty, StructuredProperty } from '../../../common/dto/Property.js'

const Long = new MetaFormat(
  'Long',
  new StructuredProperty({
    name: 'Long',
    description: 'Long meta format',
    propertyDefinitions: {
      title: {
        mandatory: true,
        property: new Property({
          name: 'Title',
          description: 'Name of the dataset',
          type: 'string'
        })
      },
      description: {
        mandatory: true,
        property: new Property({
          name: 'Description',
          description: 'Short description about the contents of the dataset',
          type: 'string'
        })
      },
      keywords: {
        mandatory: true,
        property: new ListProperty({
          name: 'List of keywords',
          minSize: 3,
          property: new Property({
            name: 'Keyword',
            description: 'Single-word keyword describing the content of the dataset',
            type: 'string'
          })
        })
      },
      tags: {
        mandatory: true,
        property: new ListProperty({
          name: 'List of tags',

          property: new Property({
            name: 'Tag',
            description:
              'Single-word tag describing the content of the dataset from a fixed set of values',
            domain: [
              'simple',
              'average',
              'detailed',
              'public',
              'confidential',
              'local',
              'national'
            ].map((v) => ({ value: v })),
            isDomainStrict: true,
            type: 'string'
          })
        })
      },
      note: {
        mandatory: true,
        property: new Property({
          name: 'Note',
          description: 'Custom note for the author',
          type: 'string'
        })
      },
      topics: {
        mandatory: true,
        property: new ListProperty({
          name: 'List of topics',
          minSize: 2,
          property: new StructuredProperty({
            name: 'Topic',
            description: 'Single topic of the dataset',
            propertyDefinitions: {
              "name": {
                mandatory: true,
                property: new Property({
                  name: 'Name',
                  description: 'Name of the topic',
                  type: 'string'
                })
              },
              "description": {
                mandatory: true,
                property: new Property({
                  name: 'Description',
                  description: 'Description of the topic',
                  type: 'string'
                })
              }
            }
          })
        })
      }
    }
  })
)

export default Long
