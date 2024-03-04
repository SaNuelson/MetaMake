import React from "react";
import { KBButton, Table, KnowledgeBaseTableRow, KBButtonLink } from "../helpers/Table";

export default function KnowledgeBaseManager(): React.JSX.Element {
  return (
    <div>
      <div>
        <Table>
          <KnowledgeBaseTableRow kbName={'ABC Inc. KB'} format={'DCAT-AP-CZ'} changedOn={'2022-02-02'} other={''}></KnowledgeBaseTableRow>
          <KnowledgeBaseTableRow kbName={'DEF Inc. KB'} format={'DCAT-AP-CZ'} changedOn={'2022-04-04'} other={''}></KnowledgeBaseTableRow>
        </Table>
      </div>
      <div className="float-left space-x-2">
        <KBButtonLink title={'New...'} href="?kb=new"></KBButtonLink>
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
