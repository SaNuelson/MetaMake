import { ReactElement } from "react";
import { StructuredMetaProperty } from "../../../../../common/dto/MetaProperty";
import { TEInput } from "tw-elements-react";
import MetaModel, { PrimitiveMetaDatum } from "../../../../../common/dto/MetaModel";
import { Button } from "../../common/Buttons";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";

type NodeProps = {
  model: MetaModel,
  metaBase: MetaBase,
  path: string,
  setProperty: (path: string, value: any) => void
}

export function MetaModelEditorNode({ model, metaBase, path, setProperty}: NodeProps): ReactElement {
  console.log(model, metaBase, path);
  const [arity, property, data] = model.getData(path);
  console.log('+', arity, property, data);

  if (Array.isArray(data)) {
    console.log("KBEditNode[array]", model, path, arity, property, data);
    return (
      <div className="mt-8">
        <div className="flex justify-center">
          <label>{property.name}</label>
          <ul className="ml-2">
            {data.map((item, idx) => (
              <li key={idx}>
                {MetaModelEditorNode({ model, metaBase, path: `${path}[${idx}]`, setProperty })}
              </li>
            ))}
          </ul>
          <ul>
            <div className="p-2 flex justify-end">
              <Button className="mx-2"><IoAddOutline /></Button>
              <Button className="mx-2"><IoCloseOutline /></Button>
            </div>
          </ul>
        </div>
      </div>
    );
  }

  if (property.type === "object") {
    console.log("KBEditNode[object]", model, path, arity, property, data);
    return (<div className="mt-8">
      <label>{property.name}</label>
      <ul className="ml-2">
        {Object.values((property as StructuredMetaProperty).children).map(({property}, idx) =>
          <li key={idx}>
            {MetaModelEditorNode({ model, metaBase, path: [path, property.name].join("."), setProperty})}
          </li>
        )}
      </ul>
    </div>);
  }

  if (!(data instanceof PrimitiveMetaDatum)) {
    throw new Error("Malformed data: Property structured, datum is not.");
  }

  const value = data.value;
  console.log("KBEditNode[primitive]", model, path, arity, property, data, value);
  const alternatives: any[] = metaBase.map(([model, source]) => model.getValue(path));
  console.log("KBEditNode[primitive]", model, path, arity, property, data, value, alternatives, alternatives.map(((alt, i) => ({name: alt, value: i+1}))));

  return (
    <div className="flex flex-row justify-around mt-6">
      <TEInput
        label={property.name}
        type={property.type}
        value={value ?? ""}
        onChange={ev => setProperty(path, ev.target.value)}>

        <small
          id="emailHelp2"
          className="absolute w-full text-neutral-500 dark:text-neutral-200"
        >
          {property.description}
        </small>
      </TEInput>
      <TESelect
        data={alternatives.map(((alt, i) => ({text: alt, value: i+1})))}
        value={1}
      />
    </div>
  );
}
