import { useEffect, useState } from "react";
import { Table, TableRow, TableItem } from "../helpers/Table";

export default function DataPreview() {
  let [preview, setPreview] = useState([] as string[][]);

  useEffect(() => {
    window.api.listenDataChanged(() =>
      window.api.requestDataPreview()
        .then((newPreview) => {
          console.log(`DataPreview.setPreview(${newPreview})`)
          setPreview(newPreview)
        }));
  })

  const rowsData = preview
    .map(row => row
      .map(item => <TableItem title={item}/>))
    .map(row => <TableRow>{row}</TableRow>);

  return (
    <div>
      <div>
        <Table hasHeader={false}>
          {rowsData}
        </Table>
      </div>
    </div>
  )
}
