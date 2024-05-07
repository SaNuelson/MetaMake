import { ReactElement } from "react";
import MetaProperty, {
  StructuredMetaProperty
} from "../../../../../common/dto/MetaProperty";
import { TEInput } from "tw-elements-react";
import MetaModel from "../../../../../common/dto/MetaModel";

type NodeProps = {
  property: MetaProperty,
  path: string,
  model: MetaModel,
  setProperty: (path: string, value: any) => void
}

export function KnowledgeBaseEditorNode({ property, path, model, setProperty}: NodeProps): ReactElement {
  console.log("KBEdNode", property, path, model);

  if (property.type === "object") {
    return (<div className="mt-8">
      <label>{property.name}</label>
      <ul className="ml-2">
        {Object.values((property as StructuredMetaProperty).children).map(({property}, idx) =>
          <li key={idx}>
            {KnowledgeBaseEditorNode({ property, path: (path ? path + '.' : '') + property.name, model, setProperty})}
          </li>
        )}
      </ul>
    </div>);
  }

  return (
    <TEInput
      label={property.name}
      type={property.type}
      className="mt-6"
      value={model.getValue(path)}
      onChange={ev => setProperty(path, ev.target.value)}>

      <small
        id="emailHelp2"
        className="absolute w-full text-neutral-500 dark:text-neutral-200"
      >
        {property.description}
      </small>
    </TEInput>
  );
}
