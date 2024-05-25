import { useEffect, useState } from "react";
import { KnowledgeBaseInfo } from "../../../../common/dto/KnowledgeBase";
import MetaFormat from "../../../../common/dto/MetaFormat";

type useKnowledgeBaseInfoReturn = {
  knowledgeBaseInfos: KnowledgeBaseInfo[],
  isComplete: boolean
}

export function useKnowledgeBaseList(format?: MetaFormat): useKnowledgeBaseInfoReturn {
  console.log(`useKnowledgeBaseInfos(${format?.name})`);
  const [knowledgeBaseInfos, setKnowledgeBaseInfo] = useState<KnowledgeBaseInfo[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    window.api.requestKnowledgeBaseList(format?.name).then((data) => {
      console.log(`useKnowledgeBaseInfos(${format?.name}) done.`);
      setKnowledgeBaseInfo(data);
      setIsComplete(true);
    });
    }, [format]);

  return { knowledgeBaseInfos, isComplete };
}
