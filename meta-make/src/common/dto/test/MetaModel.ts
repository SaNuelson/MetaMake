import MetaProperty, { StructuredMetaProperty } from '../MetaProperty'
import MetaFormat from '../MetaFormat'
import MetaModel, { MetaDatum, PrimitiveMetaDatum, StructuredMetaDatum } from "../MetaModel";
import { strict as assert } from 'node:assert'
import { MandatoryArity, OneOrMoreArity, OptionalArity } from '../ArityBounds'
import Restructurable from "../Restructurable.js";

describe('MetaModel, when constructed', () => {
  const authorNameProp = new MetaProperty({ name: 'Name', description: '', type: 'string' })
  const authorAgeProp = new MetaProperty({ name: 'Age', description: '', type: 'number' })
  const authorsProp = new StructuredMetaProperty({
    name: 'Author',
    description: 'Author of the data',
    children: [
      { arity: MandatoryArity, property: authorNameProp },
      { arity: OptionalArity, property: authorAgeProp }
    ]
  })

  const titleProp = new MetaProperty({ name: 'Title', description: '', type: 'string' })
  const keywordProp = new MetaProperty({ name: 'Keyword', description: '', type: 'string' })

  const testFormatProps = new StructuredMetaProperty({
    name: 'Props',
    description: '',
    children: [
      { arity: MandatoryArity, property: titleProp },
      { arity: { min: 3, max: 10 }, property: keywordProp },
      { arity: OneOrMoreArity, property: authorsProp }
    ]
  })

  const testFormat = new MetaFormat('TestFormat', testFormatProps)

  it('should be able to create & fill meta format', () => {
    const model = new MetaModel(testFormat)

    assert.deepEqual(model.getValue('Author[0].Name'), undefined)
    model.setValue('Author[0].Name', 'Jack')
    assert.deepEqual(model.getValue('Author[0].Name'), 'Jack')

    assert.deepEqual(model.getValue('Author[1].Age'), undefined)
    model.setValue('Author[1].Name', 'Jill')
    assert.deepEqual(model.getValue('Author[1].Name'), 'Jill')
    model.setValue('Author[1].Age', 32)
    assert.deepEqual(model.getValue('Author[1].Age'), 32)
  })

  it('should be able to be restructured', () => {
    Restructurable.addClass(MetaFormat)

    Restructurable.addClass(MetaProperty)
    Restructurable.addClass(StructuredMetaProperty)

    Restructurable.addClass(MetaModel)
    Restructurable.addClass(MetaDatum)
    Restructurable.addClass(PrimitiveMetaDatum)
    Restructurable.addClass(StructuredMetaDatum)

    const model = new MetaModel(testFormat)
    const modelClone = structuredClone(model);
    const restructuredModel: MetaModel = Restructurable.restructure(modelClone);

    assert.deepEqual(restructuredModel.getValue('Author[0].Name'), 'Jack');
    assert.deepEqual(restructuredModel.getValue('Author[1].Name'), 'Jill');
    assert.deepEqual(restructuredModel.getValue('Author[1].Age'), 32);
  })
})
