import React, { useEffect, useState } from "react";
import Pipeline from '../../../../common/dto/Pipeline.js'

type usePipelineReturn = {
  pipeline: Pipeline | undefined,
  setPipeline:  React.Dispatch<React.SetStateAction<Pipeline | undefined>>
}

/**
 * Fetches and sets the knowledge base based on the provided ID. If ID is keyword 'create',
 * complete flag is set immediately and knowledgeBase stays undefined.
 * @param {string} pipeId - The ID of the knowledge base to be fetched.
 * @throws {Error} If `kbId` is not provided or is empty.
 * @returns {Object} An object containing the fetched `knowledgeBase` and the `isComplete` flag.
 */
export function usePipeline(pipeId: string | undefined): usePipelineReturn {
  const [pipeline, setPipeline] = useState<Pipeline | undefined>(undefined);

  useEffect(() => {
    if (!pipeId) {
      throw new Error("Not in create, nor edit mode (kbId slug empty).");
    }
    else if (pipeId === 'create') {
      console.log("usePipeline new")
      setPipeline(Pipeline.Empty())
    }
    else {
      window.api.requestPipeline(pipeId).then((pipe: Pipeline) => {
        console.groupCollapsed("usePipeline response");
        console.log(pipe);
        console.groupEnd();

        setPipeline(pipe);
      });
    }
  }, []);

  return { pipeline, setPipeline };
}
