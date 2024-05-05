import React, { useEffect, useState } from 'react'
import { MetaUrl } from '../../../../../common/constants'
import { createMetaUrl } from '../../../../../common/utils/url'
import { KnowledgeBaseInfo } from '../../../../../common/dto/KnowledgeBase'
import { Button, ButtonLink } from "../../common/Buttons";

export default function KnowledgeBaseManager(): React.JSX.Element {
  document.title = 'Knowledge Base Manager'

  // @ts-ignore TODO
  const [knowledgeBaseList, setKnowledgeBaseList] = useState([] as KnowledgeBaseInfo[])
  const [selectedKBIdx, setSelectedKBIdx] = useState(undefined as number | undefined)

  useEffect(() => {
    window.api.requestKnowledgeBaseList().then((knowledgeBases: KnowledgeBaseInfo[]) => {
      console.groupCollapsed('KnowledgeBaseManager.setBases')
      console.log(knowledgeBases)
      console.groupEnd()
      setKnowledgeBaseList(knowledgeBases)
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
                      {knowledgeBaseList.map((kb, i) => (
                        <KnowledgeBaseTableRow
                          key={i}
                          kb={kb}
                          onSelected={() => setSelectedKBIdx(selectedKBIdx === i ? undefined : i)}
                          isSelected={selectedKBIdx === i}
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
              href={createMetaUrl(MetaUrl.KnowledgeBaseCreate)}
            ></ButtonLink>
            <Button text="Load"></Button>
          </div>
          <div className="float-right space-x-2">
            <ButtonLink
              text="Edit"
              disabled={selectedKBIdx === undefined}
              href={createMetaUrl(MetaUrl.KnowledgeBase, knowledgeBaseList[selectedKBIdx ?? 0]?.id)}
            ></ButtonLink>
            <Button text={'Duplicate'}></Button>
            <Button text={'Delete'}></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

type KBRowProps = {
  kb: KnowledgeBaseInfo
  isSelected: boolean
  onSelected: () => void
}

function KnowledgeBaseTableRow({ kb, isSelected, onSelected }: KBRowProps): React.JSX.Element {
  return (
    <tr
      className={
        'border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600' +
        (isSelected ? ' bg-neutral-400' : '')
      }
      onClick={onSelected}
    >
      <td className="whitespace-nowrap px-6 py-4 font-medium">{kb.name}</td>
      <td className="whitespace-nowrap px-6 py-4">{kb.format}</td>
      <td className="whitespace-nowrap px-6 py-4">{kb.changedOn.toISOString()}</td>
    </tr>
  )
}
