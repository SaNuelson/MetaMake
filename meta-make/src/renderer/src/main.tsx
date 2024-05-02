import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import 'tw-elements-react/dist/css/tw-elements-react.min.css'
import Restructurable from '../../common/dto/Restructurable'
import InitDtos from './dto/Init'

InitDtos()

const contextIsolated = await window.rawApi.isContextIsolated()
console.log("Context isolated?", contextIsolated);
const debugEnabled = await window.rawApi.isDebugEnabled()
console.log("Debug enabled?", debugEnabled);

if (contextIsolated) {
  window.api = {} as any;
  Object.keys(window.rawApi).forEach(key => {
    window.api[key] = async (...args: any[]) => {
      if(debugEnabled)
        console.trace(`[RDRR -> MAIN] ${key}(${args})`);
      const result = await window.rawApi[key](...args);
      if(debugEnabled)
        console.trace(`MAIN -> RDRR ${key}(...) => ${result}`);

      return Restructurable.restructure(result);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
