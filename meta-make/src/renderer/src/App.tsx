import DataPreview from './components/windows/DataPreview/DataPreview'
import React from 'react'
import KnowledgeBaseManager from './components/windows/KnowledgeBaseManager/KnowledgeBaseManager'
import KnowledgeBaseEditor from './components/windows/KnowledgeBaseEditor/KnowledgeBaseEditor'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MetaModelEditor from "./components/windows/MetaModelEditor/MetaModelEditor";

class App extends React.Component {
  render(): React.JSX.Element {
    const queryParameters = new URLSearchParams(window.location.search)
    const knowledgeBase = queryParameters.get('kb')
    console.log(`"${knowledgeBase}"`)

    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<DataPreview />} />
          <Route path="/kb" element={<KnowledgeBaseManager />} />
          <Route path="/kb/:kb" element={<KnowledgeBaseEditor />} />
          <Route path="/mb" element={<MetaModelEditor />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
