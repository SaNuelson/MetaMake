import { strict as assert } from 'assert'
import MetaModel from "../MetaModel";
import MetaFormat from "../MetaFormat";
import MetaProperty, { StructuredMetaProperty } from "../MetaProperty";

describe('MetaModel, when constructed', () => {

  const numberProp = new MetaProperty("P1", "Number property", "number");
  const stringProp = new MetaProperty("P2", "String property", "string");
  const dateProp = new MetaProperty("P3", "Date property", "date");

  const innerStruct = new StructuredMetaProperty(
    "SP2",
    "Structured property 2",
    [numberProp, stringProp]);

  const outerStruct = new StructuredMetaProperty(
    "SP1",
    "Structured property 1",
    [innerStruct]);

  const testFormat = new MetaFormat("Test", outerStruct);

  it('should properly flatten structured meta properties', () => {
    const metaModel = new MetaModel(testFormat);

    assert.doesNotThrow(() => metaModel.getValue(numberProp));
    assert.doesNotThrow(() => metaModel.getValue(stringProp));
    assert.doesNotThrow(() => metaModel.getValue(dateProp));
    assert.doesNotThrow(() => metaModel.getValue(innerStruct));
    assert.doesNotThrow(() => metaModel.getValue(outerStruct));
  });
});
