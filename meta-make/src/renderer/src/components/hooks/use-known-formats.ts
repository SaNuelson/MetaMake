import { useEffect, useState } from "react";
import MetaFormat from "../../../../common/dto/MetaFormat";

export function useKnownFormats() {
  const [knownFormats, setKnownFormats] = useState([] as MetaFormat[]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  // code related to knownFormats
  useEffect(() => {
    window.api.requestMetaFormats().then((metaFormats: MetaFormat[]) => {
      console.groupCollapsed("KnowledgeBaseEditor.setFormats");
      console.log(metaFormats);
      console.groupEnd();

      setKnownFormats(metaFormats);
      setIsComplete(true);
    });
  }, []);
  return { knownFormats, isComplete };
}
