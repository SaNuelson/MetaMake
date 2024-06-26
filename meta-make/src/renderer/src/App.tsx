import DataPreview from './components/windows/DataPreview/DataPreview'
import React from 'react'
import KnowledgeBaseManager from './components/windows/KnowledgeBaseManager/KnowledgeBaseManager'
import KnowledgeBaseEditor from './components/windows/KnowledgeBaseEditor/KnowledgeBaseEditor'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MetaModelEditor from "./components/windows/MetaModelEditor/MetaModelEditor";
import PipelineManager from './components/windows/PipelineManager/PipelineManager.js'
import PipelineEditor from './components/windows/PipelineEditor/PipelineEditor.js'

class App extends React.Component {
  render(): React.JSX.Element {
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<DataPreview />} />
          <Route path="/kb" element={<KnowledgeBaseManager />} />
          <Route path="/kb/:kb" element={<KnowledgeBaseEditor />} />
          <Route path="/pipe" element={<PipelineManager />} />
          <Route path="/pipe/:pipe" element={<PipelineEditor />} />
          <Route path="/mb" element={<MetaModelEditor />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
