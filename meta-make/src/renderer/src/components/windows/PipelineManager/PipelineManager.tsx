import React, { useEffect, useState } from 'react'
import { MetaUrl } from '../../../../../common/constants'
import { createMetaUrl } from '../../../../../common/utils/url'
import { Button, ButtonLink } from "../../common/Buttons";
import { PipelineInfo } from '../../../../../common/dto/Pipeline'

export default function PipelineManager(): React.JSX.Element {
  document.title = 'Pipeline Manager'

  const [pipelineList, setPipelineList] = useState([] as PipelineInfo[])
  const [selectedPipelineIdx, setSelectedPipelineIdx] = useState(undefined as number | undefined)

  useEffect(() => {
    window.api.requestPipelineList().then((pipelineInfos: PipelineInfo[]) => {
      console.groupCollapsed('PipelineInfo.setPipelines')
      console.log(pipelineInfos)
      console.groupEnd()
      setPipelineList(pipelineInfos)
    })
  }, [])

  return (
    <div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2">
            <div className="overflow-hidden">
              <div className="rounded-t-[15px] border-2 border-b-0 bg-gradient-to-b from-secondary-100 to-white m-2">
                <div className="p-2">
                  <table className="min-w-full text-left text-sm font-light">
                    <thead>
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Format
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Changed on
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    {pipelineList.map((pipeInfo, i) => (
                      <PipelineTableRow
                        key={i}
                        pipeline={pipeInfo}
                        onSelected={() => setSelectedPipelineIdx(selectedPipelineIdx === i ? undefined : i)}
                        isSelected={selectedPipelineIdx === i}
                      />
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-around px-4">
          <div className="float-left space-x-2">
            <ButtonLink
              text="New"
              href={createMetaUrl(MetaUrl.PipelineCreate)}
            ></ButtonLink>
            <Button text="Load"></Button>
          </div>
          <div className="float-right space-x-2">
            <ButtonLink
              text="Edit"
              disabled={selectedPipelineIdx === undefined}
              href={createMetaUrl(MetaUrl.Pipeline, pipelineList[selectedPipelineIdx ?? 0]?.id)}
            ></ButtonLink>
            <Button text={'Duplicate'}></Button>
            {/* TODO: confirmation modal */}
            <Button
              text={'Delete'}
              disabled={selectedPipelineIdx === undefined}
              onClick={() => window.api.deleteKnowledgeBase(pipelineList[selectedPipelineIdx!].id)}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

type KBRowProps = {
  pipeline: PipelineInfo
  isSelected: boolean
  onSelected: () => void
}

function PipelineTableRow({ pipeline, isSelected, onSelected }: KBRowProps): React.JSX.Element {
  return (
    <tr
      className={
        'border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600' +
        (isSelected ? ' bg-neutral-400' : '')
      }
      onClick={onSelected}
    >
      <td className="whitespace-nowrap px-6 py-4 font-medium">{pipeline.id}</td>
      <td className="whitespace-nowrap px-6 py-4">{pipeline.name}</td>
      <td className="whitespace-nowrap px-6 py-4">{pipeline.changedOn.toISOString()}</td>
    </tr>
  )
}
