import { ReactElement, useState } from 'react'
import { TEInput } from 'tw-elements-react'
import { KnowledgeBase } from '../../../../../common/dto/KnowledgeBase'
import Modal from '../../helpers/Modal'
import MetaFormat from '../../../../../common/dto/MetaFormat'
import { useNavigate, useParams } from 'react-router-dom'
import { MetaUrl } from '../../../../../common/constants'
import { createMetaUrl } from '../../../../../common/utils/url'
import { useKnowledgeBase } from '../../hooks/use-knowledge-base'
import { KnowledgeBaseEditorNode } from './KnowledgeBaseEditorNode'
import MetaProperty from '../../../../../common/dto/MetaProperty'
import MetaFormatSelect from '../../common/MetaFormatSelect'

export default function KnowledgeBaseEditor(): ReactElement {
  const kbId = useParams()['kb']

  const {
    knowledgeBase,
    setKnowledgeBase: setKnowledgeBase
  } = useKnowledgeBase(kbId)

  function copyKnowledgeBase(kb: KnowledgeBase): KnowledgeBase {
    return new KnowledgeBase(kb.id, kb.name, kb.format, kb.model, kb.changedOn)
  }

  function setKnowledgeBaseProp<T extends keyof KnowledgeBase>(key: T, val: KnowledgeBase[T]) {
    const copy = copyKnowledgeBase(knowledgeBase!)
    copy[key] = val
    setKnowledgeBase(copy)
  }

  function setModelProp(prop: MetaProperty, val: any) {
    const copy = copyKnowledgeBase(knowledgeBase!)
    copy.model.setValue(prop, val)
    setKnowledgeBase(copy)
  }

  function setActiveFormat(format: MetaFormat) {
    console.log('setActiveFormat', format.name)
    setKnowledgeBase(KnowledgeBase.Empty(format))
  }

  const [isModalShown, showModal] = useState(false)

  const isChanged = false
  const navigation = useNavigate()

  return (
    <div className="p-5">
      <div className="flex justify-center">
        <div className="relative mb-3 md:w-96">
          <TEInput
            type="text"
            label="Knowledge base name"
            size="lg"
            className="mb-6"
            value={knowledgeBase?.name ?? ''}
            onChange={(ev) => setKnowledgeBaseProp('name', ev.target.value)}
          />
          <MetaFormatSelect
            onFormatSelected={setActiveFormat}
            selectedFormat={knowledgeBase?.format}
          />
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-center">
        <div className="block w-3/4 rounded-lg bg-white px-6 py-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          {knowledgeBase ? (
            <KnowledgeBaseEditorNode
              property={knowledgeBase.format.metaProps}
              model={knowledgeBase.model}
              setProperty={setModelProp}
            />
          ) : (
            <div>Loading meta formats...</div>
          )}
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-around">
        <button onClick={() => (isChanged ? showModal(true) : navigation(-1))} className="">
          Back
        </button>
        <button
          onClick={() => {
            if (!knowledgeBase) throw new Error('Unable to save if no format selected.')
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
