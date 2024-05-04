import { useEffect, useState } from "react";
import DataInfo from "../../../../common/dto/DataInfo";

type UseDataPreviewReturn = {
  preview?: DataInfo
}

export function useDataPreview(): UseDataPreviewReturn {
  const [preview, setPreview] = useState<DataInfo | undefined>(undefined);

  useEffect(() => {
    window.api.listenDataChanged(() =>
      window.api.requestDataPreview().then((newPreviewDto: DataInfo) => {
        if (newPreviewDto) {
          setPreview(newPreviewDto)
        }
      })
    )
  })

  return { preview };
}
