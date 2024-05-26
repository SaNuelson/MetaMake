import MetaModel, {
  isListMetaDatum,
  isPrimitiveMetaDatum,
  isStructuredMetaDatum,
  Primitive
} from '../../../../common/dto/MetaModel'
import MetaModelSource, { MetaBase } from '../../../../common/dto/MetaModelSource'
import { ReactElement } from 'react'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'
import { Button } from './Buttons'
import { IoCloseOutline } from 'react-icons/io5'
import Property, { ListProperty, StructuredProperty } from '../../../../common/dto/Property.js'
import { VscAdd } from 'react-icons/vsc'
import { Input, OptionData, Select } from './Inputs'

type FormatFormProps = {
  model: MetaModel,
  onChange: (model: MetaModel) => void
}

export function ModelForm({model, onChange}: FormatFormProps): ReactElement {
  function setModelProp(path: string, val: any) {
    model.setValue(path, val);
    onChange(model);
  }

  function extendModelProp(path: string) {
    model.addValue(path);
    onChange(model);
  }

  function deleteModelProp(path: string) {
    model.deleteValue(path);
    onChange(model);
  }

  return <FormatFormNode
    model={model}
    path=''
    setProperty={setModelProp}
    extendProperty={extendModelProp}
    deleteProperty={deleteModelProp}
  />
}

type NodeProps = {
  model: MetaModel,
  metaBase?: MetaBase,
  path: string,
  setProperty: (path: string, value: any) => void
  extendProperty: (path: string) => void
  deleteProperty: (path: string) => void
}

export function FormatFormNode({ model, metaBase, path, setProperty, extendProperty, deleteProperty }: NodeProps): ReactElement {
  const [property, datum] = model.getData(path);

  if (property instanceof ListProperty) {

    if (!isListMetaDatum(datum)) {
      console.error(`Found list property ${property.name} but datum was not.`);
      return <div>Faulty datum</div>
    }

    const canAdd = datum.values.length < property.maxSize
    const canDelete = property.minSize < datum.values.length

    return (
      <div className="mt-8">
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <label>
          {property.name} ({property.minSize ?? 0}..{property.maxSize ?? 'N'})
        </label>
        <br />
        <small className="w-full text-neutral-500 dark:text-neutral-200">
          {property.description}
        </small>
        <ul className="ml-2">
          {datum.values.map((item, idx) => (
            <li key={idx}>
              <div className="flex my-4">
                <div className="flex-1 flex flex-col justify-center">
                  <FormatFormNode
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

  if (property instanceof StructuredProperty) {

    if (!isStructuredMetaDatum(datum)) {
      console.error(`Found structured property ${property.name} but datum was not.`);
      return <div>Faulty datum</div>
    }

    return (
      <div className="block w-full my-2 rounded-lg bg-white px-4 py-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <label>
          {property.name}
        </label>
        <br />
        <small className="w-full text-neutral-500 dark:text-neutral-200">
          {property.description}
        </small>
        <ul className="ml-2">
          {Object.entries((property as StructuredProperty).propertyDefinitions).map(
            ([name, { property }], idx, arr) => (
              <li key={idx} className={idx < arr.length - 1 ? 'mb-6' : ''}>
                <FormatFormNode
                  model={model}
                  metaBase={metaBase}
                  path={[path, name].join('.')}
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

  if (!isPrimitiveMetaDatum(datum)) {
    console.error(`Found structured property ${property.name} but datum was not.`);
    return <div>Faulty datum</div>
  }

  const alternatives: {source: MetaModelSource, value: Primitive | Primitive[]}[] = metaBase
    ? metaBase.models.map(([model, source]) => ({source, value: model.getValue(path)}))
    : [];

  return (<PrimitiveNode
    showDescription={true}
    property={property}
    value={datum.value}
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
    property: Property,
    value: any,
    alternatives: {source: MetaModelSource, value: any}[],
    setValue: (newValue: any) => void
  }): ReactElement {

  const altOptions: OptionData[] = alternatives.map(({ source, value }) => ({
    text: source.name,
    value: value ?? 'UNKNOWN',
  }));

  if (property.domain && property.isDomainStrict) {
    return (
      <Select
        data={property.domain.map(x => ({text: x.value, value: x.value}))}
        onChange={ev => setValue(ev.target.value)}
        value={value}
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
