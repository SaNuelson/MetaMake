import MetaProperty, { Mandatory, Optional, Some, StructuredMetaProperty } from "../MetaProperty";
import MetaFormat from "../MetaFormat";
import MetaModel from "../MetaModel";
import { strict as assert } from 'node:assert'

describe('MetaModel, when constructed', () => {

  const authorNameProp = new MetaProperty("Name", "", "string");
  const authorAgeProp = new MetaProperty("Age", "", "number");
  const authorsProp = new StructuredMetaProperty(
    "Author",
    "Author of the data",
    [
      {arity: Mandatory, property: authorNameProp},
      {arity: Optional, property: authorAgeProp}
    ]
  )

  const titleProp = new MetaProperty("Title", "", "string");
  const keywordProp = new MetaProperty("Keyword", "", "string");

  const testFormatProps = new StructuredMetaProperty(
    "Props",
    "",
    [
      {arity: Mandatory, property: titleProp},
      {arity: {min:3, max:10}, property: keywordProp},
      {arity: Some, property: authorsProp}
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
