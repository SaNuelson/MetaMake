import Property, { ListProperty, StructuredProperty } from '../Property.js'
import MetaFormat from '../MetaFormat'
import MetaModel from "../MetaModel";
import { strict as assert } from 'node:assert'
import Restructurable from "../Restructurable.js";

describe('MetaModel, when constructed', () => {
  const authorNameProp = new Property({ name: 'Name', description: '', type: 'string' })
  const authorAgeProp = new Property({ name: 'Age', description: '', type: 'number' })
  const authorsProp = new StructuredProperty({
    name: 'Author',
    description: 'Author of the data',
    propertyDefinitions: {
      "name": { mandatory: true, property: authorNameProp },
      "age": { mandatory: false, property: authorAgeProp }
    }
  })

  const titleProp = new Property({ name: 'Title', description: '', type: 'string' })
  const keywordProp = new Property({ name: 'Keyword', description: '', type: 'string' })

  const testFormatProps = new StructuredProperty({
    name: 'Props',
    description: '',
    propertyDefinitions: {
      "title": {
        mandatory: true,
        property: titleProp
      },
      "keywords": {
        mandatory: true,
        property: new ListProperty({
          name: "Keyword list",
          property: keywordProp,
          minSize: 3,
          maxSize: 10,
        })
      },
      "authors": {
        mandatory: true,
        property: new ListProperty({
          name: "Authors",
          minSize: 1,
          property: authorsProp,
        })
      }
    }
  })

  const testFormat = new MetaFormat('TestFormat', testFormatProps)

  it('should be able to create & fill meta format', () => {
    const model = new MetaModel(testFormat)

    assert.deepEqual(model.getValue('authors[0].name'), null)
    model.setValue('authors[0].name', 'Jack')
    assert.deepEqual(model.getValue('authors[0].name'), 'Jack')

    assert.deepEqual(model.getValue('authors[1].age'), null)
    model.setValue('authors[1].name', 'Jill')
    assert.deepEqual(model.getValue('authors[1].name'), 'Jill')
    model.setValue('authors[1].age', 32)
    assert.deepEqual(model.getValue('authors[1].age'), 32)
  })

  it('should be able to be restructured', () => {
    Restructurable.addClass(MetaFormat)

    Restructurable.addClass(Property)
    Restructurable.addClass(ListProperty)
    Restructurable.addClass(StructuredProperty)

    Restructurable.addClass(MetaModel)

    const model = new MetaModel(testFormat)

    model.setValue('authors[0].name', 'Jack');
    model.setValue('authors[1].name', 'Jill');
    model.setValue('authors[1].age', 32);

    const modelClone = structuredClone(model);
    const restructuredModel: MetaModel = Restructurable.restructure(modelClone);

    assert.deepEqual(restructuredModel.getValue('authors[0].name'), 'Jack');
    assert.deepEqual(restructuredModel.getValue('authors[1].name'), 'Jill');
    assert.deepEqual(restructuredModel.getValue('authors[1].age'), 32);
  })
})
