import { ReactElement, useState } from "react";
import { MetaModelEditorNode } from "./MetaModelEditorNode";
import MetaModel from "../../../../../common/dto/MetaModel";
import { MetaBase } from "../../../../../common/dto/MetaModelSource";
import Essential from "../../../../../main/format/Essential";
import { KnowledgeBase } from "../../../../../common/dto/KnowledgeBase";

export default function MetaModelEditor(): ReactElement {
  const metaBase: MetaBase = [
    [new MetaModel(Essential), {name: "Alpha", label: "A"}],
    [new MetaModel(Essential), {name: "Beta", label: "B"}]
  ]
  const alpha = metaBase[0][0];
  alpha.setValue(".Title", "Alpha Data");
  alpha.setValue(".Description", "Alpha Description");
  const beta = metaBase[1][0];
  beta.setValue(".Title", "Beta Data");
  beta.setValue(".Description", "Beta Description");

  const isComplete = true;
  //const { metaBase, isComplete } = useMetaBase();
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
