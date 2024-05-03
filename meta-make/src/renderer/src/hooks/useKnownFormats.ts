// hooks/useKnownFormats.ts
import { useState, useEffect } from 'react';
import MetaFormat from "../../../common/dto/MetaFormat";

export function useKnownFormats() {
  const [knownFormats, setKnownFormats] = useState([] as MetaFormat[]);
  // code related to knownFormats
  useEffect(() => {
    console.log('useKnownFormats effect');
    window.api.requestMetaFormats().then((metaFormats: MetaFormat[]) => {
      setKnownFormats(metaFormats);
    })
  });
  return knownFormats;
}
