import { ReactElement, useEffect, useState } from 'react'
import { TEInput, TESelect } from 'tw-elements-react'
import { KnowledgeBase } from '../../../../common/dto/KnowledgeBase'
import Modal from '../helpers/Modal'
import MetaFormat from '../../../../common/dto/MetaFormat'
import { useNavigate, useParams } from 'react-router-dom'
import { MetaUrl } from '../../../../common/constants'
import MetaProperty, { ListMetaProperty, StructuredMetaProperty } from "../../../../common/dto/MetaProperty";
import { createMetaUrl } from '../../../../common/utils/url'
import { SelectData } from 'tw-elements-react/dist/types/forms/Select/types'
import MetaModel from "../../../../common/dto/MetaModel";

export default function KnowledgeBaseEditor(): ReactElement {
  const [knownFormats, setKnownFormats] = useState([] as MetaFormat[])
  // @ts-ignore TODO
  const [activeFormat, setActiveFormat] = useState(undefined as MetaFormat | undefined)
  const [knowledgeBase, setKnowledgeBase] = useState(undefined as KnowledgeBase | undefined)

  const [isModalShown, showModal] = useState(false)

  useEffect(() => {
    window.api.requestMetaFormats().then((metaFormats: MetaFormat[]) => {
      console.groupCollapsed('KnowledgeBaseEditor.setFormats')
      console.log(metaFormats)
      console.groupEnd()

      setKnownFormats(metaFormats)

      if (!editMode) {
        const firstFormat = metaFormats[0]
        setActiveFormat(firstFormat)
        setKnowledgeBase(KnowledgeBase.Empty(firstFormat))
      }
    })
  }, [])

  const kbId = useParams()['kb']
  const editMode = kbId !== 'create'
  useEffect(() => {
    if (kbId && kbId !== 'create') {
      window.api.requestKnowledgeBase(kbId).then((kb) => {
        setActiveFormat(kb.format)
        setKnowledgeBase(kb)
      })
    }
  }, [])

  const isChanged = false
  const navigation = useNavigate()

  const formatSelection: SelectData[] = knownFormats.map((f: MetaFormat, i: number) => ({
    text: f.name,
    value: i + 1,
    defaultSelected: editMode ? f.name === knowledgeBase?.format.name : i === 0
  }))

  return (
    <div className="p-5">
      <div className="flex justify-center">
        <div className="relative mb-3 md:w-96">
          <TEInput type="text" label="Knowledge base name" size="lg" className="mb-6" />
          <TESelect
            label="Meta format"
            data={formatSelection}
            multiple={false}
            onValueChange={(select) => {
              const idx = ((select as SelectData).value as number) - 1
              setActiveFormat(knownFormats[idx])
              // TODO: Lose unsaved changes modal
              setKnowledgeBase(KnowledgeBase.Empty(knownFormats[idx]))
            }}
          />
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-center">
        <div className="block w-3/4 rounded-lg bg-white px-6 py-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700" >
          {knowledgeBase &&
            <KnowledgeBaseEditorNode property={knowledgeBase.format.metaProps} model={knowledgeBase.model} />}
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-around">
        <button onClick={() => (isChanged ? showModal(true) : navigation(-1))} className="">
          Back
        </button>
        <button
          onClick={() => {
            if (!knowledgeBase)
              throw new Error('Unable to save if no format selected.');
            window.api.updateKnowledgeBase(knowledgeBase)
          }}
          disabled={!knowledgeBase}
          className=""
        >
          Save
        </button>
      </div>

      <Modal
        title="Discard changes?"
        isShown={isModalShown}
        hasCloseButton={true}
        buttonConfig={[
          {
            text: 'Yes',
            onClick: () => {
              navigation(createMetaUrl(MetaUrl.KnowledgeBase))
              return true
            }
          },
          { text: 'No', onClick: () => true }
        ]}
      >
        This knowledge base is not saved. Are you sure you want to go back and discard+
      </Modal>
    </div>
  )
}

type NodeProps = {
  property: MetaProperty,
  model: MetaModel
}

function KnowledgeBaseEditorNode({property, model} : NodeProps): ReactElement {
  console.log("KnowledgeBaseEditorNode", property, model)

  if (property.type === "object") {
    return (<div className="mt-8">
      <label>{property.name}</label>
      <ul className="ml-2">
        {(property as StructuredMetaProperty).children.map((property, idx) =>
          <li key={idx}>
            {KnowledgeBaseEditorNode({property, model})}
          </li>
        )}
      </ul>
    </div>)
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
            onChange={ev=>model.setValue(property, ev.target.value)}>

            <small
              id="emailHelp2"
              className="absolute w-full text-neutral-500 dark:text-neutral-200"
            >
              {property.description}
            </small>
          </TEInput>
        </li>
      </ol>
    </div>)
  }

  return (
    <TEInput
      label={property.name}
      type={property.type}
      className="mt-6"
      value={model.getValue(property)}
      onChange={ev=>model.setValue(property, ev.target.value)}>

      <small
        id="emailHelp2"
        className="absolute w-full text-neutral-500 dark:text-neutral-200"
      >
        {property.description}
      </small>
    </TEInput>
  );
}
