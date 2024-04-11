import { ReactElement, useEffect, useState } from 'react'
import { TEInput, TESelect } from 'tw-elements-react'
import { KnowledgeBase } from '../../../../common/dto/KnowledgeBase'
import Modal from '../helpers/Modal'
import MetaFormat from '../../../../common/dto/MetaFormat'
import { useNavigate } from 'react-router-dom'
import { getMetaUrl, MetaUrl } from '../../../../common/constants'
import MetaProperty, { StructuredMetaProperty } from '../../../../common/dto/MetaProperty'
import { SelectData } from 'tw-elements-react/dist/types/forms/Select/types'

export default function KnowledgeBaseEditor(): ReactElement {
  const [knownFormats, setKnownFormats] = useState([] as MetaFormat[])
  const [activeFormat, setActiveFormat] = useState(undefined as MetaFormat | undefined)
  const [knowledgeBase, setKnowledgeBase] = useState(undefined as KnowledgeBase | undefined)

  const [isModalShown, showModal] = useState(false)

  useEffect(() => {
    window.api.requestMetaFormats().then((metaFormats: MetaFormat[]) => {
      console.log(`KnowledgeBaseEditor.setFormats(${metaFormats})`)
      setKnownFormats(metaFormats)
    })
  }, [])

  const isChanged = false
  const navigation = useNavigate()

  return (
    <div className="p-5">
      <div className="flex justify-center">
        <div className="relative mb-3 md:w-96">
          <TEInput type="text" label="Knowledge base name" size="lg" className="mb-6" />

          <TESelect
            data={state.metaFormats.map((f: MetaFormat, i: number) => ({ text: f.name, value: i }))}
            multiple={false}
            onValueChange={(select) => {
              const idx = (select as SelectData).value as number
              setActiveFormat(knownFormats[idx])
              if (!knowledgeBase) setKnowledgeBase(KnowledgeBase.Empty(knownFormats[idx]))
            }}
          />
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div>
        {knowledgeBase &&
          Object.entries(knowledgeBase.format.metaProps).map(([name, prop]) => (
            <KnowledgeBaseEditorNode key={name} property={prop} />
          ))}
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-around">
        <button onClick={() => (isChanged ? showModal(true) : navigation(-1))} className="">
          Back
        </button>
        <button
          onClick={() => {
            /*TODO*/
          }}
          className=""
        >
          Save
        </button>
      </div>

      <Modal
        title="Discard changes?"
        isShown={state.isModalShown}
        hasCloseButton={true}
        buttonConfig={[
          {
            text: 'Yes',
            onClick: () => {
              navigation(getMetaUrl(MetaUrl.KnowledgeBase))
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
  property: MetaProperty
}

function KnowledgeBaseEditorNode({property} : NodeProps): ReactElement {
  switch(property.type) {
    case "object":
      return (<div>
        {(property as StructuredMetaProperty).children.map(property => KnowledgeBaseEditorNode({property}))}
      </div>)
    case "string":
      return <TEInput type="text" />
    case "email":
      return <TEInput type="email" />
    default:
      return "I dunno."
  }
}
