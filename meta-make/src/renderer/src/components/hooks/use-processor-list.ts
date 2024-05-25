import { useEffect, useState } from "react";
import { ProcessorInfo } from '../../../../main/processing/Processor.js'

type useProcessorListReturn = {
  processorList: ProcessorInfo[],
  isComplete: boolean
}

export function useProcessorList(): useProcessorListReturn {
  const [processorList, setProcessorList] = useState<ProcessorInfo[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    window.api.requestProcessorList()
      .then((data) => {
        console.log("useProcessorList done with", data)
        setProcessorList(data);
        setIsComplete(true);
    });
  }, []);

  return { processorList, isComplete };
}
