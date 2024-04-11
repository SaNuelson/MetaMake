import React from 'react'
import { KBButton, KBButtonLink, KnowledgeBaseTableRow, Table } from '../helpers/Table'
import { createMetaUrl, MetaUrl } from '../../../../common/constants'

export default function KnowledgeBaseManager(): React.JSX.Element {
  return (
    <div>
      <div>
        <Table>
          <KnowledgeBaseTableRow
            kbName={'ABC Inc. KB'}
            format={'DCAT-AP-CZ'}
            changedOn={'2022-02-02'}
            other={''}
          ></KnowledgeBaseTableRow>
          <KnowledgeBaseTableRow
            kbName={'DEF Inc. KB'}
            format={'DCAT-AP-CZ'}
            changedOn={'2022-04-04'}
            other={''}
          ></KnowledgeBaseTableRow>
        </Table>
      </div>
      <div className="float-left space-x-2">
        <KBButtonLink
          title={'New...'}
          href={createMetaUrl(MetaUrl.KnowledgeBaseCreate)}
        ></KBButtonLink>
        <KBButton title={'Load...'}></KBButton>
      </div>
      <div className="float-right space-x-2">
        <KBButton title={'Edit'}></KBButton>
        <KBButton title={'Duplicate'}></KBButton>
        <KBButton title={'Delete'}></KBButton>
      </div>
    </div>
  )
}
