import { ReactElement, useEffect, useState } from 'react'
import { TEInput, TESelect } from 'tw-elements-react'
import { KnowledgeBase } from '../../../../common/dto/KnowledgeBase'

export default function KnowledgeBaseEditor(): ReactElement {
  const [metaFormatList, setMetaFormatList] = useState([] as string[])
  useEffect(() => {
    window.api.requestMetaFormatList().then((mfList: string[]) => {
      console.log('KnowledgeBaseEditor.setFormatList()', mfList)
      setMetaFormatList(mfList)
    })
  }, [])

  const [state, setState] = useState({} as KnowledgeBase)

  return (
    <div className="p-5">
      <div className="flex justify-center">
        <div className="relative mb-3 md:w-96">
          <TEInput type="text" label="Knowledge base name" size="lg" className="mb-6" />

          <TESelect data={metaFormatList.map((format) => ({ text: format, value: format }))} />
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-around">
        <button onClick={onClickBack} className="">
          Back
        </button>
        <button onClick={onClickSave} className="">
          Save
        </button>
      </div>
    </div>
  )
}

function onClickBack(): void {
  console.log('back')
}

function onClickSave(): void {
  console.log('save')
}
