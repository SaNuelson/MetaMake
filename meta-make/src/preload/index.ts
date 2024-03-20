import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { DataInfo } from '../common/dto/DataInfo'
import { EventType } from '../common/constants'
import Restructurable from '../common/dto/Restructurable'

export type StringHandlingCallback = (value: string) => void
export type EmptyCallback = () => void

export interface MetaMakeAPI {
  requestDataPreview: () => Promise<DataInfo | null>
  requestMetaFormatList: () => Promise<string[]>
  listenDataChanged: (dataChangedCallback: EmptyCallback) => void
}

Restructurable.addClass(DataInfo)

// Custom APIs for renderer
const api: MetaMakeAPI = {
  requestDataPreview: () =>
    ipcRenderer
      .invoke(EventType.DataPreviewRequested)
      .then((result) => Restructurable.restructure(result)),
  requestMetaFormatList: () => ipcRenderer.invoke(EventType.MetaFormatListRequested),
  listenDataChanged: (dataChangedCallback) =>
    ipcRenderer.on(EventType.DataChanged, dataChangedCallback)
}

console.log('process.contextIsolated', process.contextIsolated)
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
