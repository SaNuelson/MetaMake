import React, { useEffect, useState } from "react";
import { KnowledgeBase } from "../../../../common/dto/KnowledgeBase";

type useKnowledgeBaseReturn = {
  knowledgeBase: KnowledgeBase | undefined,
  setKnowledgeBase:  React.Dispatch<React.SetStateAction<KnowledgeBase | undefined>>,
  isComplete: boolean
}

/**
 * Fetches and sets the knowledge base based on the provided ID. If ID is keyword 'create',
 * complete flag is set immediately and knowledgeBase stays undefined.
 * @param {string} kbId - The ID of the knowledge base to be fetched.
 * @throws {Error} If `kbId` is not provided or is empty.
 * @returns {Object} An object containing the fetched `knowledgeBase` and the `isComplete` flag.
 */
export function useKnowledgeBase(kbId: string | undefined): useKnowledgeBaseReturn {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | undefined>(undefined);
  const [isComplete, setComplete] = useState<boolean>(false);

  useEffect(() => {
    if (!kbId) {
      throw new Error("Not in create, nor edit mode (kbId slug empty).");
    } else if (kbId === "create") {
      setComplete(true);
    } else if (kbId) {
      window.api.requestKnowledgeBase(kbId).then((kb: KnowledgeBase) => {
        console.groupCollapsed("KnowledgeBaseEditor.setKnowledgeBase");
        console.log(kb);
        console.groupEnd();

        setKnowledgeBase(kb);
        setComplete(true);
      });
    }
  }, []);

  return { knowledgeBase, setKnowledgeBase, isComplete };
}
