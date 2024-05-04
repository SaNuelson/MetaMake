import { useEffect, useState } from "react";
import { KnowledgeBaseInfo } from "../../../../common/dto/KnowledgeBase";
import MetaFormat from "../../../../common/dto/MetaFormat";

type useKnowledgeBaseInfoReturn = {
  knowledgeBaseInfos: KnowledgeBaseInfo[],
  isComplete: boolean
}

export function useKnowledgeBaseInfos(format?: MetaFormat): useKnowledgeBaseInfoReturn {
  const [knowledgeBaseInfos, setKnowledgeBaseInfo] = useState<KnowledgeBaseInfo[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    window.api.requestKnowledgeBaseList(format?.name).then((data) => {
      setKnowledgeBaseInfo(data);
      setIsComplete(true);
    });
    }, [format]);

  return { knowledgeBaseInfos, isComplete };
}
