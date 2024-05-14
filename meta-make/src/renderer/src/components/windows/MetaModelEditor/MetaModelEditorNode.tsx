import { ReactElement, useState } from "react";
import MetaProperty, { EnumMetaProperty, StructuredMetaProperty } from "../../../../../common/dto/MetaProperty";
import MetaModel, { Primitive, PrimitiveMetaDatum } from "../../../../../common/dto/MetaModel";
import { Button } from "../../common/Buttons";
import { IoCloseOutline } from "react-icons/io5";
import MetaModelSource, { MetaBase } from "../../../../../common/dto/MetaModelSource";
import { TEInput, TESelect } from "tw-elements-react";
import { SelectData } from "tw-elements-react/dist/types/forms/Select/types";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { VscAdd } from "react-icons/vsc";
import { Input, OptionData, Select } from "../../common/Inputs.js";

type NodeProps = {
  model: MetaModel,
  metaBase: MetaBase,
  path: string,
  setProperty: (path: string, value: any) => void
  extendProperty: (path: string) => void
  deleteProperty: (path: string) => void
}

export function MetaModelEditorNode({ model, metaBase, path, setProperty, extendProperty, deleteProperty }: NodeProps): ReactElement {
  const [arity, property, data] = model.getData(path);

  if (Array.isArray(data)) {

    const canAdd = !arity.max || data.length < arity.max
    const canDelete = !arity.min || arity.min < data.length

    return (
      <div className="mt-8">
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <label>
          {property.name} ({arity.min ?? 0}..{arity.max ?? 'N'})
        </label>
        <br />
        <small className="w-full text-neutral-500 dark:text-neutral-200">
          {property.description}
        </small>
        <ul className="ml-2">
          {data.map((item, idx) => (
            <li key={idx}>
              <div className="flex my-4">
                <div className="flex-1 flex flex-col justify-center">
                  <MetaModelEditorNode
                    model={model}
                    metaBase={metaBase}
                    path={`${path}[${idx}]`}
                    setProperty={setProperty}
                    extendProperty={extendProperty}
                    deleteProperty={deleteProperty}
                  />
                </div>
                <div className="flex flex-col justify-center mx-2">
                  <Button sm rounded="top">
                    <SlArrowUp />
                  </Button>
                  <Button
                    sm
                    rounded="none"
                    disabled={!canDelete}
                    onClick={() => deleteProperty(`${path}[${idx}]`)}
                  >
                    <IoCloseOutline />
                  </Button>
                  <Button sm rounded="bottom">
                    <SlArrowDown />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <ul>
          <div className="p-2 flex justify-center">
            <Button
              xl
              className="rounded-lg"
              disabled={!canAdd}
              onClick={() => extendProperty(path)}
            >
              <VscAdd />
            </Button>
          </div>
        </ul>
      </div>
    );
  }

  if (property.type === "object") {
    return (
      <div className="block w-full my-2 rounded-lg bg-white px-4 py-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <label>
          {property.name} ({arity.min ?? 0}..{arity.max ?? 'N'})
        </label>
        <br />
        <small className="w-full text-neutral-500 dark:text-neutral-200">
          {property.description}
        </small>
        <ul className="ml-2">
          {Object.values((property as StructuredMetaProperty).children).map(
            ({ property }, idx, arr) => (
              <li key={idx} className={idx < arr.length - 1 ? 'mb-6' : ''}>
                <MetaModelEditorNode
                  model={model}
                  metaBase={metaBase}
                  path={[path, property.name].join('.')}
                  setProperty={setProperty}
                  extendProperty={extendProperty}
                  deleteProperty={deleteProperty}
                />
              </li>
            )
          )}
        </ul>
      </div>
    );
  }

  if (!(data instanceof PrimitiveMetaDatum)) {
    throw new Error("Malformed data: Property structured, datum is not.");
  }

  const alternatives: {source: MetaModelSource, value: Primitive | Primitive[]}[] = metaBase.models.map(([model, source]) => ({source, value: model.getValue(path)}));
  const isInArray = !arity.max || arity.max > 1

  return (<PrimitiveNode
    showDescription={!isInArray}
    property={property}
    value={data.value}
    alternatives={alternatives}
    setValue={(value) => setProperty(path, value)}
  />
  );
}

function PrimitiveNode(
  {
    showDescription,
    property,
    value,
    alternatives,
    setValue
  } : {
    showDescription: boolean,
    property: MetaProperty,
    value: any,
    alternatives: {source: MetaModelSource, value: any}[],
    setValue: (newValue: any) => void
  }): ReactElement {

  const altOptions: OptionData[] = alternatives.map(({ source, value }, i) => ({
    text: source.name,
    value: value ?? 'UNK',
  }));

  if (property.subType && property.subType === 'enum') {
    if (!(property instanceof EnumMetaProperty)) {
      throw new Error(`Got property '${property.name}' with enum subtype, was not EnumProperty.`);
    }
    return (
      <Select
        data={property.domain.map(x => ({text: x.label, value: x.label}))}

      />
    )
  }

  return (
    <div className="flex flex-row justify-around mt-6">
      <Input
        className='flex-1'
        label={property.name}
        type={property.type}
        value={value ?? ''}
        onChange={(ev) => {
          setValue(ev.target.value)
        }}
        data={altOptions}
        tooltip={showDescription ? property.description : undefined}
      />
    </div>
  )
}
