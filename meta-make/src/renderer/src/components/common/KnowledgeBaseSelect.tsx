import { TESelect } from 'tw-elements-react'
import { SelectData } from 'tw-elements-react/dist/types/forms/Select/types'
import { ReactElement, useEffect, useState } from "react";
import MetaFormat from "../../../../common/dto/MetaFormat";
import { KnowledgeBaseInfo } from "../../../../common/dto/KnowledgeBase";
import { useKnowledgeBaseList } from "../hooks/use-knowledge-base-list.js";

type Props = {
  onKBSelected: (kbInfo?: KnowledgeBaseInfo) => void,
  onlyFormat?: MetaFormat,
  allowEmpty?: boolean
}

export default function KnowledgeBaseSelect({ onKBSelected, onlyFormat, allowEmpty } : Props): ReactElement {

  const { knowledgeBaseInfos, isComplete } = useKnowledgeBaseList(onlyFormat);
  const [ activeKnowledgeBaseInfo, setActiveKnowledgeBaseInfo] = useState<KnowledgeBaseInfo | undefined>();

  useEffect(() => {
    if (isComplete) {
      console.log("KBSelect KBInfo get complete", knowledgeBaseInfos);
      onKBSelected(knowledgeBaseInfos[0]);
      setActiveKnowledgeBaseInfo(knowledgeBaseInfos[0]);
    }
  }, [isComplete, onlyFormat]);

  if (activeKnowledgeBaseInfo && knowledgeBaseInfos.every(kbi => kbi.name !== activeKnowledgeBaseInfo?.name)) {
    setActiveKnowledgeBaseInfo(undefined)
  }

  const formatOptions: SelectData[] = knowledgeBaseInfos
    .map(kbi => ({
    text: kbi.name,
    value: kbi.id,
  }));
  if (allowEmpty) {
    formatOptions.unshift({ text: "None", value: "None" });
  }

  console.log("KBSelect options", onlyFormat?.name, knowledgeBaseInfos, formatOptions, activeKnowledgeBaseInfo?.name);

  if (!isComplete) {
    console.log("KBSelect incomplete version");
    return (
      <TESelect
        label="Knowledge base"
        placeholder={"Loading ..."}
        data={[{}]}
        value={undefined}
        disabled={true}
      />
    )
  }

  console.log("KBSelect default version");
  return (
    <TESelect
      label="Knowledge base"
      disabled={!isComplete || !formatOptions.length}
      data={formatOptions}
      value={activeKnowledgeBaseInfo?.id ?? "None"}
      onValueChange={(select) => {
        if (!select) {
          setActiveKnowledgeBaseInfo(undefined);
          onKBSelected();
          return
        }

        const id = (select as SelectData).value;
        const selectedKbi = knowledgeBaseInfos.find(kbi=>kbi.id===id);
        setActiveKnowledgeBaseInfo(selectedKbi);
        onKBSelected(selectedKbi!);
      }}
    />
  )
}
