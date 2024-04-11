import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import DataInfo from '../common/dto/DataInfo'
import { EventType } from '../common/constants'
import MetaFormat from '../common/dto/MetaFormat'

export type StringHandlingCallback = (value: string) => void
export type EmptyCallback = () => void

export interface MetaMakeAPI {
  isContextIsolated: () => Promise<boolean>
  isDebugEnabled: () => Promise<boolean>
  requestDataPreview: () => Promise<DataInfo | null>
  requestMetaFormats: () => Promise<MetaFormat[]>
  requestMetaFormatList: () => Promise<string[]>
  listenDataChanged: (dataChangedCallback: EmptyCallback) => void
}

// Custom APIs for renderer
const api: MetaMakeAPI = {
  isContextIsolated: async () => true, // TODO
  isDebugEnabled: async () => true, // TODO
  requestDataPreview: () => ipcRenderer.invoke(EventType.DataPreviewRequested),
  requestMetaFormats: () => ipcRenderer.invoke(EventType.MetaFormatsRequested),
  requestMetaFormatList: () => ipcRenderer.invoke(EventType.MetaFormatListRequested),
  listenDataChanged: (dataChangedCallback) =>
    ipcRenderer.on(EventType.DataChanged, dataChangedCallback)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('rawApi', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.rawApi = api
  window.api = api
}
