import React from "react";
import { KBButton, Table, KnowledgeBaseTableRow } from "../helpers/Table";

export default function KnowledgeBaseManager(): React.JSX.Element {
  return (
    <div>
      <div>
        <Table>
          <KnowledgeBaseTableRow knowledge_base_name={'ABC Inc. KB'} format={'DCAT-AP-CZ'} date_created={'2022-02-02'} other={''}></KnowledgeBaseTableRow>
          <KnowledgeBaseTableRow knowledge_base_name={'DEF Inc. KB'} format={'DCAT-AP-CZ'} date_created={'2022-04-04'} other={''}></KnowledgeBaseTableRow>
        </Table>
      </div>
      <div className="float-left space-x-2">
        <KBButton title={'New...'}></KBButton>
        <KBButton title={'Load...'}></KBButton>
      </div>
      <div className="float-right space-x-2">
        <KBButton title={'Edit'}></KBButton>
        <KBButton title={'Duplicate'}></KBButton>
        <KBButton title={'Delete'}></KBButton>
      </div>
    </div>
  );
}
