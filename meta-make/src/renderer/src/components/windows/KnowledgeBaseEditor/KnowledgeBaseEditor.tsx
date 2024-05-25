import { ReactElement, useState } from 'react'
import { TEInput } from 'tw-elements-react'
import { KnowledgeBase } from '../../../../../common/dto/KnowledgeBase'
import Modal from '../../helpers/Modal'
import MetaFormat from '../../../../../common/dto/MetaFormat'
import { useNavigate, useParams } from 'react-router-dom'
import { MetaUrl } from '../../../../../common/constants'
import { createMetaUrl } from '../../../../../common/utils/url'
import { useKnowledgeBase } from '../../hooks/use-knowledge-base.js'
import MetaFormatSelect from '../../common/MetaFormatSelect'
import { FormatFormNode } from '../../common/FormatFormNode.js'

export default function KnowledgeBaseEditor(): ReactElement {
  const kbId = useParams()['kb']

  const { knowledgeBase, setKnowledgeBase } = useKnowledgeBase(kbId)

  function copyKnowledgeBase(kb: KnowledgeBase): KnowledgeBase {
    return new KnowledgeBase(kb.id, kb.name, kb.format, kb.model, kb.changedOn)
  }

  function setKnowledgeBaseProp<T extends keyof KnowledgeBase>(key: T, val: KnowledgeBase[T]) {
    const copy = copyKnowledgeBase(knowledgeBase!)
    copy[key] = val
    setKnowledgeBase(copy)
    setIsChanged(true)
    updateDocumentTitle()
  }

  function setModelProp(path: string, val: any) {
    const copy = copyKnowledgeBase(knowledgeBase!)
    copy.model.setValue(path, val)
    setIsChanged(true)
    setKnowledgeBase(copy)
    console.log('setModelProp(', path, ',', val, ') ', knowledgeBase, ' -->', copy)
  }

  function extendModelProp(path: string) {
    const copy = copyKnowledgeBase(knowledgeBase!)
    copy.model.addValue(path)
    setIsChanged(true)
    setKnowledgeBase(copy)
    console.log('extendModelProp(', path, ') ', knowledgeBase, ' -->', copy)
  }

  function deleteModelProp(path: string) {
    const copy = copyKnowledgeBase(knowledgeBase!)
    copy.model.deleteValue(path)
    setIsChanged(true)
    setKnowledgeBase(copy)
    console.log('deleteModelProp(', path, ') ', knowledgeBase, ' -->', copy)
  }

  function setActiveFormat(format: MetaFormat) {
    console.log('setActiveFormat', format.name)

    if (format.name === knowledgeBase?.format.name) return

    setKnowledgeBase(KnowledgeBase.Empty(format))
    updateDocumentTitle()
  }

  function updateDocumentTitle() {
    document.title = knowledgeBase
      ? `${knowledgeBase.name} - ${knowledgeBase.format.name}${isChanged ? '*' : ''}`
      : 'Knowledge Base Editor'
  }

  const [isModalShown, setIsModalShown] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const navigation = useNavigate()

  updateDocumentTitle()

  return (
    <div>
      <div className="flex justify-center pt-6 min-h-[10vh] bg-gradient-to-t from-white to-gray-100">
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
        <div className="block w-3/4 rounded-lg bg-white px-6 py-3">
          {knowledgeBase ? (
            <FormatFormNode
              model={knowledgeBase.model}
              path=""
              setProperty={setModelProp}
              extendProperty={extendModelProp}
              deleteProperty={deleteModelProp}
            />
          ) : (
            <div>Loading meta formats...</div>
          )}
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-around">
        <button onClick={() => (isChanged ? setIsModalShown(true) : navigation(-1))} className="">
          Back
        </button>
        <button
          onClick={() => {
            if (!knowledgeBase) throw new Error('Unable to save if no format selected.')
            window.api.updateKnowledgeBase(knowledgeBase)
            setIsChanged(false)
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
        setIsShown={setIsModalShown}
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
        This knowledge base is not saved. Are you sure you want to go back and discard?
      </Modal>
    </div>
  )
}
