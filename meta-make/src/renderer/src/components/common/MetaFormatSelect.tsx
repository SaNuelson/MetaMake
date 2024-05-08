import { TESelect } from 'tw-elements-react'
import { SelectData } from 'tw-elements-react/dist/types/forms/Select/types'
import { ReactElement, useEffect, useState } from "react";
import { useKnownFormats } from "../hooks/use-known-formats";
import MetaFormat from "../../../../common/dto/MetaFormat";

type Props = {
  onFormatSelected: (format: MetaFormat) => void,
  selectedFormat?: MetaFormat
}

export default function MetaFormatSelect({ onFormatSelected, selectedFormat } : Props): ReactElement {
  const {knownFormats, isComplete } = useKnownFormats();
  const [activeFormat, setActiveFormat] = useState(undefined as MetaFormat | undefined)

  useEffect(() => {
    if (isComplete) {
      onFormatSelected(selectedFormat ?? knownFormats[0]);
    }
  }, [isComplete]);

  if (!isComplete) {
    return <TESelect
      label="Meta format (loading...)"
      data={[]}
      disabled
    />
  }

  if (selectedFormat && activeFormat?.name !== selectedFormat?.name) {
    setActiveFormat(knownFormats.find(f => f.name === selectedFormat?.name));
  }

  const formatOptions: SelectData[] = knownFormats.map((f: MetaFormat, i: number) => ({
    text: f.name,
    value: i + 1,
    defaultSelected: selectedFormat ? f.name === selectedFormat?.name : i === 0
  }));

  return (
    <TESelect
      label="Meta format"
      disabled={!isComplete}
      data={formatOptions}
      multiple={false}
      onValueChange={(select) => {
        const idx = ((select as SelectData).value as number) - 1
        onFormatSelected(knownFormats[idx]);
      }}
    />
  )
}
