import MetaFormat from '../../common/dto/MetaFormat'
import MetaProperty from '../../common/dto/MetaProperty'

const Basic = new MetaFormat('Basic', {
  title: new MetaProperty('Title', 'Name of the dataset', 'string'),
  description: new MetaProperty(
    'Description',
    'Short description about the contents of the dataset',
    'string'
  )
})

export default Basic;
