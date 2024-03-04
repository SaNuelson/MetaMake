import { useEffect, useState } from "react";
import { Table, TableRow, TableItem } from "../helpers/Table";
import { DataInfo } from "../../../../common/type";

export default function DataPreview() {
  let [preview, setPreview] = useState(null as DataInfo | null);

  useEffect(() => {
    window.api.listenDataChanged(() =>
      window.api.requestDataPreview()
        .then((newPreviewDto: DataInfo | null) => {
          console.log('DataPreview.setPreview()', newPreviewDto);
          if (newPreviewDto !== null) {
            setPreview(newPreviewDto);
          }
        }));
  })

  if (preview === null) {
    return (
      <div>
        No data provided. Please load a data file using menu Data &rarr; Load data... (Ctrl+O)
      </div>
    )
  }

  const rowsData = [preview.header, ...preview.data]
    .map(row => row
      .map((item, i) => <TableItem title={item} key={i}/>))
    .map((row, i) => <TableRow key={i}>{row}</TableRow>);
  return (
    <div>
      <div>
        <Table hasHeader={!!preview.header}>
          {rowsData}
        </Table>
      </div>
    </div>
  )
}
