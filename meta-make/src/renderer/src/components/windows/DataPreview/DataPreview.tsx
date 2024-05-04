import { ReactElement, useState } from "react";
import { Table, TableItem, TableRow } from '../../helpers/Table'
import MetaFormatSelect from '../../common/MetaFormatSelect'
import KnowledgeBaseSelect from '../../common/KnowledgeBaseSelect'
import { useDataPreview } from "../../hooks/use-data-preview";
import MetaFormat from "../../../../../common/dto/MetaFormat";

export default function DataPreview(): ReactElement {
  const {preview} = useDataPreview();
  const [selectedFormat, setSelectedFormat] = useState<MetaFormat|undefined>();


  if (!preview) {
    return (
      <div>
        No data provided. Please load a data file using menu Data &rarr; Load data... (Ctrl+O)
      </div>
    )
  }

  const rowsData = [preview.header, ...preview.data]
    .map((row) => row.map((item, i) => <TableItem title={item} key={i} />))
    .map((row, i) => <TableRow key={i}>{row}</TableRow>);

  return (
    <div>
      <div className="rounded-t-[15px] border-2 border-b-0 bg-gradient-to-b from-secondary-100 to-white m-2">
        <div className="p-2">
          <Table hasHeader={!!preview.header}>{rowsData}</Table>
          <p className="text-right">(... {preview.rowCount - 5} additional rows)</p>
          <p className="text-right">Width: {preview.width}</p>
        </div>
      </div>

      <div className="flex justify-start">
        <div className="w-3/8 p-2">
          <MetaFormatSelect onFormatSelected={setSelectedFormat} />
        </div>
        <div className="w-3/8 p-2">
          <KnowledgeBaseSelect onKBSelected={() => {}} onlyFormat={selectedFormat} />
        </div>
        <div className="w-1/8 p-2">
          <button
            type="button"
            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          >
            Process
          </button>
        </div>
      </div>
    </div>
  )
}
