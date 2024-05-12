import { useEffect, useState } from "react";
import { MetaBase } from "../../../../common/dto/MetaModelSource";

type UseMetaBasewReturn = {
  metaBase: MetaBase | undefined,
  isComplete: boolean
}

export function useMetaBase(): UseMetaBasewReturn {
  const [isDataProcessed, setIsDataProcessed] = useState<boolean>(false);
  const [metaBase, setMetaBase] = useState<MetaBase | undefined>();

  useEffect(() => {
    // Check if processed before, or wait to be processed after
    window.api.checkDataProcessed()
      .then(isProcessed => isProcessed && setIsDataProcessed(true))
    window.api.listenDataProcessed(() => {
      setIsDataProcessed(true);
    })
  }, []);

  useEffect(() => {
    window.api.requestMetaBase()
      .then(setMetaBase);
  }, [isDataProcessed]);

  return { metaBase, isComplete: isDataProcessed };
}
