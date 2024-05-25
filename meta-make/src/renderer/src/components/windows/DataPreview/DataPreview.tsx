import { ReactElement, useState } from 'react'
import { Table, TableItem, TableRow } from '../../helpers/Table'
import MetaFormatSelect from '../../common/MetaFormatSelect'
import KnowledgeBaseSelect from '../../common/KnowledgeBaseSelect'
import { useDataPreview } from '../../hooks/use-data-preview'
import MetaFormat from '../../../../../common/dto/MetaFormat'
import icon from '../../../../../../resources/logo.svg';
import { Button } from "../../common/Buttons";
import { KnowledgeBaseInfo } from "../../../../../common/dto/KnowledgeBase";
import { useNavigate } from "react-router-dom";
import { createMetaUrl } from "../../../../../common/utils/url";
import { MetaUrl } from "../../../../../common/constants";
import { CsvDataInfo, JsonDataInfo } from '../../../../../common/dto/DataInfo.js'

export default function DataPreview(): ReactElement {
  const { preview } = useDataPreview()
  const [selectedFormat, setSelectedFormat] = useState<MetaFormat | undefined>()
  const [selectedKbInfo, setSelectedKbInfo] = useState<KnowledgeBaseInfo | undefined>()

  const navigation = useNavigate()

  if (!preview) {
    return (
      <div className="min-h-screen flex flex-col justify-center">
        <div className='flex flex-row justify-center'>
          <img src={icon} alt="MetaMake" className='animate-[tada_1s_ease-in-out]' />
        </div>
        <div className="p-4 text-center">
          No data provided. <br/>
          Please load a data file using menu Data &rarr;
          <Button sm text='Load data ... (Ctrl+O)' onClick={window.api.requestLoadDataModal}/>
        </div>
      </div>
    )
  }

  let dataPreview;
  switch(preview.type) {
    case 'csv':
      dataPreview = <CsvDataPreview preview={preview as CsvDataInfo} />
      break;
    case 'json':
      dataPreview = <JsonDataPreview preview={preview as JsonDataInfo} />
      break;
    default:
      dataPreview = <div>Unknown data type.</div>
  }

  return (
    <div>
      <div className="rounded-t-[15px] border-2 border-b-0 bg-gradient-to-b from-secondary-100 to-white m-2">
        {dataPreview}
      </div>

      <div className="flex justify-center">
        <div className="w-3/8 p-2">
          <MetaFormatSelect onFormatSelected={setSelectedFormat} />
        </div>
        <div className="w-3/8 p-2">
          <KnowledgeBaseSelect onKBSelected={setSelectedKbInfo} onlyFormat={selectedFormat} allowEmpty={true} />
        </div>
        <div className="w-1/8 p-2">
          <Button
            text='Process'
            onClick={() =>
              window.api.requestProcessing(selectedFormat!.name, selectedKbInfo?.id)
                .then(()=>navigation(createMetaUrl(MetaUrl.MetaBase)))}
          />
        </div>
      </div>
    </div>
  )
}

function CsvDataPreview({preview}: {preview: CsvDataInfo}): ReactElement {
  const rowsData = [preview.header, ...preview.data]
    .map((row) => row.map((item, i) => <TableItem title={item} key={i} />))
    .map((row, i) => <TableRow key={i}>{row}</TableRow>)

  return <div className="p-2">
    <Table hasHeader={!!preview.header}>{rowsData}</Table>
    <p className="text-right">(... {preview.rowCount - 5} additional rows)</p>
    <p className="text-right">Width: {preview.width}</p>
  </div>;
}

function JsonDataPreview({preview}: {preview: JsonDataInfo}): ReactElement {
  console.log("preview:" , preview)
  const rowsData = preview.tokens.map(token => <TableRow>{JSON.stringify(token)}</TableRow>)
  return <div className="p-2">
    <Table>{rowsData}</Table>
    <p className="text-right">(... {preview.tokenCount - 5} additional rows)</p>
  </div>;
}
