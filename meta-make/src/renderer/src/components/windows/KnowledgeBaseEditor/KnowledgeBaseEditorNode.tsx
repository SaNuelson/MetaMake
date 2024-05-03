import { ReactElement } from "react";
import MetaProperty, {
  ListMetaProperty,
  StructuredMetaProperty
} from "../../../../../common/dto/MetaProperty";
import { TEInput } from "tw-elements-react";
import MetaModel from "../../../../../common/dto/MetaModel";

type NodeProps = {
  property: MetaProperty,
  model: MetaModel
}

export function KnowledgeBaseEditorNode({ property, model }: NodeProps): ReactElement {

  if (property.type === "object") {
    return (<div className="mt-8">
      <label>{property.name}</label>
      <ul className="ml-2">
        {(property as StructuredMetaProperty).children.map((property, idx) =>
          <li key={idx}>
            {KnowledgeBaseEditorNode({ property, model })}
          </li>
        )}
      </ul>
    </div>);
  }

  if (property.type === "array") {
    const listProperty = property as ListMetaProperty;
    return (<div className="mt-8">
      <label>{property.name}</label>
      <ol className="ml-2">
        <li key="1">
          <TEInput
            label={listProperty.name}
            type={listProperty.itemType}
            className="mt-6"
            value={model.getValue(property)}
            onChange={ev => model.setValue(property, ev.target.value)}>

            <small
              id="emailHelp2"
              className="absolute w-full text-neutral-500 dark:text-neutral-200"
            >
              {property.description}
            </small>
          </TEInput>
        </li>
      </ol>
    </div>);
  }

  return (
    <TEInput
      label={property.name}
      type={property.type}
      className="mt-6"
      value={model.getValue(property)}
      onChange={ev => model.setValue(property, ev.target.value)}>

      <small
        id="emailHelp2"
        className="absolute w-full text-neutral-500 dark:text-neutral-200"
      >
        {property.description}
      </small>
    </TEInput>
  );
}
