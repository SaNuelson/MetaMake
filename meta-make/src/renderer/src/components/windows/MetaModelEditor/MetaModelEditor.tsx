import { ReactElement, useEffect, useState } from "react";
import { KnowledgeBaseEditorNode } from "../KnowledgeBaseEditor/KnowledgeBaseEditorNode";
import { TESelect } from "tw-elements-react";
import { useMetaBase } from "../../hooks/use-meta-base";
import { MetaModelEditorNode } from "./MetaModelEditorNode";

export default function MetaModelEditor(): ReactElement {
  const { metaBase, isComplete } = useMetaBase();

  if (!isComplete) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>Loaded.</div>
  );
}
