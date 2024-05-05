import { strict as assert } from 'assert'
import MetaModel from "../MetaModel";
import MetaFormat from "../MetaFormat";
import MetaProperty, { ListMetaProperty, StructuredMetaProperty } from "../MetaProperty";

describe('MetaModel, when constructed', () => {

  const numberProp = new MetaProperty("P1", "Number property", true, "number");
  const stringProp = new MetaProperty("P2", "String property", true, "string");
  const dateProp = new MetaProperty("P3", "Date property", true, "date");
  const listProp = new ListMetaProperty("LP1", "List number properyt", "number");

  const innerStruct = new StructuredMetaProperty(
    "SP2",
    "Structured property 2",
    [numberProp, stringProp, listProp]);

  const outerStruct = new StructuredMetaProperty(
    "SP1",
    "Structured property 1",
    [innerStruct, dateProp]);

  const testFormat = new MetaFormat("Test", outerStruct);

  it('should properly flatten structured meta properties', () => {
    const metaModel = new MetaModel(testFormat);

    assert.doesNotThrow(() => metaModel.getValue(numberProp));
    assert.equal(undefined, metaModel.getValue(numberProp));
    assert.doesNotThrow(() => metaModel.setValue(numberProp, 123));
    assert.equal(123, metaModel.getValue(numberProp));

    assert.doesNotThrow(() => metaModel.getValue(listProp))
    assert.deepEqual([], metaModel.getValue(listProp));
    assert.doesNotThrow(() => metaModel.setValue(listProp, [1, 2, 3]));
    assert.deepEqual([1, 2, 3], metaModel.getValue(listProp));

    assert.doesNotThrow(() => metaModel.getValue(stringProp));
    assert.doesNotThrow(() => metaModel.getValue(dateProp));
    assert.throws(() => metaModel.getValue(innerStruct));
    assert.throws(() => metaModel.getValue(outerStruct));
  });
});
