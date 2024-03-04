import DataPreview from "./components/windows/DataPreview";
import React from "react";
import KnowledgeBaseManager from "./components/windows/KnowledgeBaseManager";
import KnowledgeBaseEditor from "./components/windows/KnowledgeBaseEditor";

class App extends React.Component {
  render(): React.JSX.Element {
    console.log("Window", window.location.search)
    const queryParameters = new URLSearchParams(window.location.search);
    const knowledgeBase = queryParameters.get("kb");
    console.log(`"${knowledgeBase}"`);

    switch (knowledgeBase) {
      case "new":
        return <KnowledgeBaseEditor/>;
      case "":
        return <KnowledgeBaseManager />;
      default:
        return <DataPreview/>;
    }
  }
}

export default App;
