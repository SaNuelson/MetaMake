import DataPreview from './components/windows/DataPreview'
import React from 'react'
import KnowledgeBaseManager from './components/windows/KnowledgeBaseManager'
import KnowledgeBaseEditor from './components/windows/KnowledgeBaseEditor'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

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
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
