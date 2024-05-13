import { ReactElement, useState } from "react";
import { MetaModelEditorNode } from "./MetaModelEditorNode";
import MetaModel from "../../../../../common/dto/MetaModel";
import { useMetaBase } from "../../hooks/use-meta-base";
import Modal from "../../helpers/Modal";
import { useNavigate } from "react-router-dom";

export default function MetaModelEditor(): ReactElement {

  const { metaBase, isComplete } = useMetaBase();
  const [ finalModel, setFinalModel] = useState<MetaModel|undefined>(undefined);
  const [isModalShown, showModal] = useState(false)
  const navigation = useNavigate()

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
    setFinalModel(new MetaModel(metaBase!.format));

  console.log("isModalShown", isModalShown);
  return (
    <div>
      <div className="flex justify-center pt-6 min-h-[10vh] bg-gradient-to-t from-white to-gray-100">
        <div className="relative mb-3 md:w-96">
          <h1>Processing results</h1>
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-center">
        <div className="block w-3/4 rounded-lg bg-white px-6 py-3">
          <MetaModelEditorNode model={finalModel!} path=''  metaBase={metaBase!} setProperty={setModelProp}/>
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-around">
        <button onClick={() => (showModal(true))}>
          Back
        </button>
        <button
          onClick={() => {}}
        >
          Export
        </button>
      </div>

      <Modal
        title="Discard changes?"
        isShown={isModalShown}
        setIsShown={showModal}
        hasCloseButton={true}
        buttonConfig={[
          {
            text: 'Yes',
            onClick: () => {
              navigation(-1)
              return true
            }
          },
          { text: 'No', onClick: () => true }
        ]}
      >
        If you go back, you lose processed metadata. Are you sure?
      </Modal>
    </div>
  );
}
