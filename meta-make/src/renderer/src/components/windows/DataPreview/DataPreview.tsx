import { ReactElement, useEffect, useState } from 'react'
import { Table, TableItem, TableRow } from '../../helpers/Table'
import DataInfo from '../../../../../common/dto/DataInfo'
import MetaFormatSelect from "../../common/MetaFormatSelect";
import KnowledgeBaseSelect from "../../common/KnowledgeBaseSelect";

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

      <MetaFormatSelect onFormatSelected={() => {
      }} />

      <KnowledgeBaseSelect onKBSelected={() => {
      }} />

      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
      >
        Process
      </button>
    </div>
  )
}
