import MetaFormat from '../../../common/dto/MetaFormat'
import React, { useEffect, useState } from 'react'
import { KnowledgeBase } from '../../../common/dto/KnowledgeBase'
import { useParams } from 'react-router-dom'

export function useKnowledgeBase(activeFormat: MetaFormat): [KnowledgeBase | undefined, React.Dispatch<React.SetStateAction<KnowledgeBase | undefined>>] {
  const [knowledgeBase, setKnowledgeBase] = useState(undefined as KnowledgeBase | undefined)

  // you need to get the kbId parameter
  const kbId = useParams()['kb']

  useEffect(() => {
    console.log('useKnowledgeBase effect')
    if (!kbId || kbId === 'create') {
      setKnowledgeBase(KnowledgeBase.Empty(activeFormat))
    } else {
      window.api.requestKnowledgeBase(kbId).then((kb) => {
        setKnowledgeBase(kb)
      })
    }
  })

  return [knowledgeBase, setKnowledgeBase]
}
