import { ReactElement, useEffect, useState } from 'react'
import { Table, TableItem, TableRow } from '../../helpers/Table'
import DataInfo from '../../../../../common/dto/DataInfo'

export default function DataPreview(): ReactElement {
  const [preview, setPreview] = useState(null as DataInfo | null)

  useEffect(() => {
    window.api.listenDataChanged(() =>
      window.api.requestDataPreview().then((newPreviewDto: DataInfo | null) => {
        console.log('DataPreview.setPreview()', newPreviewDto)
        if (newPreviewDto !== null) {
          setPreview(newPreviewDto)
        }
      })
    )
  })

  if (preview === null) {
    return (
      <div>
        No data provided. Please load a data file using menu Data &rarr; Load data... (Ctrl+O)
      </div>
    )
  }

  const rowsData = [preview.header, ...preview.data]
    .map((row) => row.map((item, i) => <TableItem title={item} key={i} />))
    .map((row, i) => <TableRow key={i}>{row}</TableRow>)
  return (
    <div>
      <div>
        <Table hasHeader={!!preview.header}>{rowsData}</Table>
        <p>(... {preview.rowCount - 5} additional rows)</p>
        <p>Width: {preview.width}</p>
      </div>
    </div>
  )
}
