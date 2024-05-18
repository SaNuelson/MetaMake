import { ReactElement } from "react";
import MetaProperty, { StructuredMetaProperty } from "../../../../../common/dto/MetaProperty";
import MetaModel, { PrimitiveMetaDatum } from '../../../../../common/dto/MetaModel'
import { Button } from '../../common/Buttons'
import { IoCloseOutline } from 'react-icons/io5'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'
import { VscAdd } from 'react-icons/vsc'
import { Input, Select } from "../../common/Inputs";

type NodeProps = {
  model: MetaModel
  path: string
  setProperty: (path: string, value: any) => void
  extendProperty: (path: string) => void
  deleteProperty: (path: string) => void
}

export function KnowledgeBaseEditorNode({
  model,
  path,
  setProperty,
  extendProperty,
  deleteProperty
}: NodeProps): ReactElement {
  console.log(model, path)
  const [arity, property, data] = model.getData(path)
  console.log('+', arity, property, data)

  if (Array.isArray(data)) {
    console.log('KBEditNode[array]', model, path, arity, property, data)

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
                  <KnowledgeBaseEditorNode
                    model={model}
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
    )
  }

  if (property.type === 'object') {
    console.log('KBEditNode[object]', model, path, arity, property, data)
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
                <KnowledgeBaseEditorNode
                  model={model}
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
    )
  }

  if (!(data instanceof PrimitiveMetaDatum)) {
    throw new Error('Malformed data: Property structured, datum is not.')
  }

  const isInArray = !arity.max || arity.max > 1

  return (
    <PrimitiveNode
      showDescription={!isInArray}
      property={property}
      path={path}
      value={data.value}
      setValue={setProperty}
    />
  )
}

function PrimitiveNode(
  {
    showDescription,
    property,
    path,
    value,
    setValue
  } : {
    showDescription: boolean,
    property: MetaProperty,
    path: string,
    value: any,
    setValue: (path: string, value: any) => void
  }) {

  if (property.domain) {
    return (
      <Select
        data={property.domain.map(x => ({text: x.value, value: x.value}))}
        value={value}
        onChange={(ev) => setValue(path, ev.target.value)}
        />
    )
  }

  return (
    <Input
      label={property.name}
      type={property.type}
      value={value ?? ''}
      onChange={(ev) => setValue(path, ev.target.value)}
      tooltip={showDescription ? property.description : undefined}
    />
  );
}
