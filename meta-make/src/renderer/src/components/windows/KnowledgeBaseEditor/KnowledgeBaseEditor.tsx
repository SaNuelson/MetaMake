import { ReactElement, useState } from 'react'
import { TEInput, TESelect } from 'tw-elements-react'
import { KnowledgeBase } from '../../../../../common/dto/KnowledgeBase'
import Modal from '../../helpers/Modal'
import MetaFormat from '../../../../../common/dto/MetaFormat'
import { useNavigate, useParams } from 'react-router-dom'
import { MetaUrl } from '../../../../../common/constants'
import { createMetaUrl } from '../../../../../common/utils/url'
import { SelectData } from 'tw-elements-react/dist/types/forms/Select/types'
import { useKnownFormats } from '../../hooks/use-known-formats'
import { useKnowledgeBase } from '../../hooks/use-knowledge-base'
import { KnowledgeBaseEditorNode } from './KnowledgeBaseEditorNode'

export default function KnowledgeBaseEditor(): ReactElement {
  const kbId = useParams()['kb']
  const editMode = kbId !== 'create'

  const { knownFormats, isComplete: areFormatsLoaded } = useKnownFormats()
  const {
    knowledgeBase,
    setKnowledgeBase,
    isComplete: isKnowledgeBaseLoaded
  } = useKnowledgeBase(kbId)

  const [activeFormat, setActiveFormat] = useState(undefined as MetaFormat | undefined)

  const [isModalShown, showModal] = useState(false)

  console.log({
    knownFormats,
    areFormatsLoaded,
    activeFormat,
    knowledgeBase,
    isModalShown,
    kbId,
    editMode
  })

  const isChanged = false
  const navigation = useNavigate()

  if (!isKnowledgeBaseLoaded) {
    return <div>Loading knowledge base...</div>
  }

  if (!areFormatsLoaded) {
    return <div>Loading meta formats...</div>
  }

  // Create mode, first run or changed format
  if (!editMode && !knowledgeBase) {
    setActiveFormat(knownFormats[0])
    setKnowledgeBase(KnowledgeBase.Empty(knownFormats[0]))
  }

  const formatSelection: SelectData[] = knownFormats.map((f: MetaFormat, i: number) => ({
    text: f.name,
    value: i + 1,
    defaultSelected: editMode ? f.name === knowledgeBase?.format.name : i === 0
  }))

  return (
    <div className="p-5">
      <div className="flex justify-center">
        <div className="relative mb-3 md:w-96">
          <TEInput
            type="text"
            label="Knowledge base name"
            size="lg"
            className="mb-6"
            onChange={ev => {if (knowledgeBase) knowledgeBase.name = ev.target.value}}/>
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
        <div className="block w-3/4 rounded-lg bg-white px-6 py-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          {knowledgeBase && (
            <KnowledgeBaseEditorNode
              property={knowledgeBase.format.metaProps}
              model={knowledgeBase.model}
            />
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

