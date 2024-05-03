import { strict as assert } from 'assert'
import MetaModel from "../MetaModel";
import MetaFormat from "../MetaFormat";
import MetaProperty, { StructuredMetaProperty } from "../MetaProperty";

describe('MetaModel, when constructed', () => {

  const numberProp = new MetaProperty(1, "P1", "Number property", "number");
  const stringProp = new MetaProperty(2, "P2", "String property", "string");
  const dateProp = new MetaProperty(3, "P3", "Date property", "date");

  const innerStruct = new StructuredMetaProperty(
    4,
    "SP2",
    "Structured property 2",
    [numberProp, stringProp]);

  const outerStruct = new StructuredMetaProperty(
    5,
    "SP1",
    "Structured property 1",
    [innerStruct, dateProp]);

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
