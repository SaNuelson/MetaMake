import { TESelect } from 'tw-elements-react'
import { SelectData } from 'tw-elements-react/dist/types/forms/Select/types'
import { ReactElement, useEffect, useState } from "react";
import MetaFormat from "../../../../common/dto/MetaFormat";
import { KnowledgeBaseInfo } from "../../../../common/dto/KnowledgeBase";
import { useKnowledgeBaseInfos } from "../hooks/use-knowledge-base-infos";

type Props = {
  onKBSelected: (kbInfo?: KnowledgeBaseInfo) => void,
  onlyFormat?: MetaFormat,
  selectedKB?: KnowledgeBaseInfo
}

export default function KnowledgeBaseSelect({ onKBSelected, onlyFormat, selectedKB } : Props): ReactElement {

  const { knowledgeBaseInfos, isComplete } = useKnowledgeBaseInfos(onlyFormat);
  const [ activeKnowledgeBaseInfo, setActiveKnowledgeBaseInfo] = useState<KnowledgeBaseInfo | undefined>();

  useEffect(() => {
    if (isComplete) {
      selectedKB ??= knowledgeBaseInfos[0];
      onKBSelected(selectedKB);
      setActiveKnowledgeBaseInfo(selectedKB);
    }
  }, [isComplete]);

  if (selectedKB && activeKnowledgeBaseInfo?.name !== selectedKB?.name) {
    setActiveKnowledgeBaseInfo(knowledgeBaseInfos.find(kbi => kbi.id === selectedKB?.id));
  }

  if (!knowledgeBaseInfos && activeKnowledgeBaseInfo) {
    setActiveKnowledgeBaseInfo(undefined)
  }

  const formatOptions: SelectData[] = knowledgeBaseInfos.map(kbi => ({
    text: kbi.name,
    value: kbi.id,
  }));

  console.log("KBSelect options", formatOptions, activeKnowledgeBaseInfo, selectedKB);

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

  if (!formatOptions.length) {
    console.log("KBSelect no format version");
    return (
      <TESelect
        label={"Knowledge base"}
        data={[{text:"No KB for format", value:1}]}
        value={1}
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
      value={activeKnowledgeBaseInfo?.id ?? 0}
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
