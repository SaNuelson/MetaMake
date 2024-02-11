import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from "@electron-toolkit/preload";


type StrHandlingCallback = (value: string) => void

export interface MetaMakeAPI {
  loadData: (path: string) => void,
  onDataLoaded: (callback: StrHandlingCallback) => void
}

// Custom APIs for renderer
const api: MetaMakeAPI = {
  loadData: (path: string) => ipcRenderer.invoke('load-data', path),
  onDataLoaded: (callback: (preview: string) => void) => ipcRenderer.on('data-loaded', (_, value) => callback(value))

}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
