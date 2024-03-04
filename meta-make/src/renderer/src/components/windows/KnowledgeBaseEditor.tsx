import React, { useEffect, useState } from 'react'
import { TEInput, TERipple, TESelect } from 'tw-elements-react'

export default function KnowledgeBaseEditor() {
  let [metaFormatList, setMetaFormatList] = useState([] as string[])
  useEffect(() => {
    console.log('useEffect')
    window.api.requestMetaFormatList().then((mfList: string[]) => {
      console.log('KnowledgeBaseEditor.setFormatList()', mfList)
      setMetaFormatList(mfList)
    })
  }, [])

  return (
    <div className="p-5">
      <div className="flex justify-center">
        <div className="relative mb-3 md:w-96">
          <TEInput type="text" label="Knowledge base name" size="lg" className="mb-6" />

          <TESelect data={metaFormatList.map((format) => ({ text: format, value: format }))} />
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  )
}

type FormProps = {
  format:
}

function KnowledgeBaseForm({format}: FormProps) {

}
