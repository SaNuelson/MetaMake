import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty, { StructuredMetaProperty } from '../../common/dto/MetaProperty'

class Essential extends MetaFormat {
  public metaProps: { [name: string]: MetaProperty } = {
    title: new MetaProperty('Title', 'Name of the dataset', 'string'),
    description: new MetaProperty(
      'Description',
      'Short description about the contents of the dataset',
      'string'
    ),
    author: new StructuredMetaProperty('Author', 'Creator of the dataset', [
      new MetaProperty('Name', 'Name of the author', 'string'),
      new MetaProperty('Email', 'Contact email', 'email')
    ])
  }
}

export default new Essential('Essential', {})
