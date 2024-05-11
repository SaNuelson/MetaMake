import { ReactElement, useState } from "react";
import { MetaModelEditorNode } from "./MetaModelEditorNode";
import MetaModel from "../../../../../common/dto/MetaModel";
import { useMetaBase } from "../../hooks/use-meta-base";

export default function MetaModelEditor(): ReactElement {

  const { metaBase, isComplete } = useMetaBase();
  const [ finalModel, setFinalModel] = useState<MetaModel|undefined>(undefined);

  function copyModel(model: MetaModel): MetaModel {
    return new MetaModel(model.metaFormat, model.root);
  }

  function setModelProp(path: string, val: any) {
    const copy = copyModel(finalModel!);
    copy.setValue(path, val);
    setFinalModel(copy);
  }

  if (!isComplete) {
    return (
      <div>Loading...</div>
    );
  }

  if (!finalModel)
    setFinalModel(new MetaModel(metaBase[0][0].metaFormat));

  return (
    <div>
      <MetaModelEditorNode model={finalModel!} path=''  metaBase={metaBase} setProperty={setModelProp}/>
    </div>
  );
}
