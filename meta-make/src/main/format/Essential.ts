import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'
import { MandatoryArity } from "../../common/dto/ArityBounds";

const Essential = new MetaFormat(
  'Essential',
  new StructuredMetaProperty('Essential', 'Essential meta format', [
    {
      arity: MandatoryArity,
      property: new MetaProperty('Title', 'Name of the dataset', 'string')
    },
    {
      arity: MandatoryArity,
      property: new MetaProperty(
        'Description',
        'Short description about the contents of the dataset',
        'string'
      )
    },
    {
      arity: MandatoryArity,
      property: new StructuredMetaProperty('Author', 'Creator of the dataset',
        [
          {
            arity: MandatoryArity,
            property: new MetaProperty('Name', 'Name of the author', 'string'),
          },
          {
            arity: MandatoryArity,
            property: new MetaProperty('Email', 'Contact email', 'string', 'email')
          },
      ])
    }
  ])
)

export default Essential
