import { TESelect } from 'tw-elements-react'
import { SelectData } from 'tw-elements-react/dist/types/forms/Select/types'
import { ReactElement, useEffect, useState } from "react";
import MetaFormat from "../../../../common/dto/MetaFormat";
import { KnowledgeBaseInfo } from "../../../../common/dto/KnowledgeBase";
import { useKnowledgeBaseInfos } from "../hooks/use-knowledge-base-infos";

type Props = {
  onKBSelected: (kbInfo: KnowledgeBaseInfo) => void,
  onlyFormat?: MetaFormat,
  selectedKB?: KnowledgeBaseInfo
}

export default function KnowledgeBaseSelect({ onKBSelected, onlyFormat, selectedKB } : Props): ReactElement {

  const { knowledgeBaseInfos, isComplete } = useKnowledgeBaseInfos(onlyFormat);
  const [ activeKnowledgeBaseInfo, setActiveKnowledgeBaseInfo] = useState(undefined as KnowledgeBaseInfo | undefined)

  useEffect(() => {
    if (isComplete) {
      onKBSelected(selectedKB ?? knowledgeBaseInfos[0]);
    }
  }, [isComplete]);

  if (!isComplete) {
    return <TESelect
      label="Knowledge base (loading...)"
      data={[]}
      disabled
    />
  }

  if (selectedKB && activeKnowledgeBaseInfo?.name !== selectedKB?.name) {
    setActiveKnowledgeBaseInfo(knowledgeBaseInfos.find(kbi => kbi.id === selectedKB?.id));
  }

  const formatOptions: SelectData[] = knowledgeBaseInfos.map((kbi: KnowledgeBaseInfo, i: number) => ({
    text: kbi.name,
    value: kbi.id,
    defaultSelected: selectedKB ? selectedKB.name === kbi.name : i === 0
  }));

  console.log(formatOptions);

  return (
    <TESelect
      label="Knowledge base"
      disabled={!isComplete}
      data={formatOptions}
      multiple={false}
      onValueChange={(select) => {
        const idx = ((select as SelectData).value as number) - 1
        onKBSelected(knowledgeBaseInfos[idx]);
      }}
    />
  )
}
