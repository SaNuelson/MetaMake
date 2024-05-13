import MetaProperty, { StructuredMetaProperty } from "../MetaProperty";
import MetaFormat from "../MetaFormat";
import MetaModel from "../MetaModel";
import { strict as assert } from 'node:assert'
import { MandatoryArity, OneOrMoreArity, OptionalArity } from "../ArityBounds";

describe('MetaModel, when constructed', () => {

  const authorNameProp = new MetaProperty("Name", "", "string");
  const authorAgeProp = new MetaProperty("Age", "", "number");
  const authorsProp = new StructuredMetaProperty(
    "Author",
    "Author of the data",
    [
      {arity: MandatoryArity, property: authorNameProp},
      {arity: OptionalArity, property: authorAgeProp}
    ]
  )

  const titleProp = new MetaProperty("Title", "", "string");
  const keywordProp = new MetaProperty("Keyword", "", "string");

  const testFormatProps = new StructuredMetaProperty(
    "Props",
    "",
    [
      {arity: MandatoryArity, property: titleProp},
      {arity: {min:3, max:10}, property: keywordProp},
      {arity: OneOrMoreArity, property: authorsProp}
    ]
  );

  const testFormat = new MetaFormat("TestFormat", testFormatProps);

  it("should be able to create & fill meta format", () => {

    const model = new MetaModel(testFormat);

    assert.deepEqual(model.getValue("Author[0].Name"), undefined)
    model.setValue("Author[0].Name", "Jack")
    assert.deepEqual(model.getValue("Author[0].Name"), "Jack")

    assert.deepEqual(model.getValue("Author[1].Age"), undefined)
    model.setValue("Author[1].Name", "Jill")
    assert.deepEqual(model.getValue("Author[1].Name"), "Jill")
    model.setValue("Author[1].Age", 32)
    assert.deepEqual(model.getValue("Author[1].Age"), 32)
  })
});
