import { useEffect, useState } from "react";
import { MetaBase } from "../../../../common/dto/MetaModelSource";

type UseMetaBasewReturn = {
  metaBase: MetaBase | undefined
}

export function useMetaBase(): UseMetaBasewReturn {
  const [isDataProcessed, setIsDataProcessed] = useState<boolean>(false);
  const [metaBase, setMetaBase] = useState<MetaBase | undefined>();

  useEffect(() => {
    // Check if processed before, or wait to be processed after
    window.api.checkDataProcessed()
      .then(isProcessed => {
        if (isProcessed) {
          console.log("Data processed before first check.");
          setIsDataProcessed(true)
        }
      })
    window.api.listenDataProcessed(() => {
      console.log("Data processed on callback");
      setIsDataProcessed(true);
    })
  }, []);

  useEffect(() => {
    if (!isDataProcessed)
      return;

    window.api.requestMetaBase()
      .then(base => {
        console.log("MetaBase retrieved", base);
        setMetaBase(base)
      });
  }, [isDataProcessed]);

  return { metaBase };
}
