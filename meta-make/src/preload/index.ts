import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import DataInfo from '../common/dto/DataInfo'
import { EventType } from '../common/constants'
import MetaFormat from '../common/dto/MetaFormat'
import { KnowledgeBase, KnowledgeBaseInfo } from '../common/dto/KnowledgeBase'

export type StringHandlingCallback = (value: string) => void
export type EmptyCallback = () => void

export interface MetaMakeAPI {
  deleteKnowledgeBase: (id: string) => Promise<void>
  requestProcessing: () => Promise<void>
  requestLoadDataModal: () => Promise<void>
  requestKnowledgeBaseList: (formatName?: string) => Promise<KnowledgeBaseInfo[]>
  requestKnowledgeBase: (id: string) => Promise<KnowledgeBase>
  updateKnowledgeBase: (kb: KnowledgeBase) => Promise<string>

  isContextIsolated: () => Promise<boolean>
  isDebugEnabled: () => Promise<boolean>

  requestDataPreview: () => Promise<DataInfo>
  requestMetaFormats: () => Promise<MetaFormat[]>
  requestMetaFormatList: () => Promise<string[]>
  listenDataChanged: (dataChangedCallback: EmptyCallback) => void
}

// Custom APIs for renderer
const api: MetaMakeAPI = {
  requestProcessing: () => ipcRenderer.invoke(EventType.DataProcessingRequested),
  requestLoadDataModal: () => ipcRenderer.invoke(EventType.LoadDataModalRequested),

  requestKnowledgeBaseList: (formatName?: string) => ipcRenderer.invoke(EventType.KnowledgeBaseListRequested, formatName),
  requestKnowledgeBase: (id: string) => ipcRenderer.invoke(EventType.KnowledgeBaseRequested, id),
  updateKnowledgeBase: (kb: KnowledgeBase) => ipcRenderer.invoke(EventType.KnowledgeBaseUpdated, kb),
  deleteKnowledgeBase: (id: string) => ipcRenderer.invoke(EventType.KnowledgeBaseDeleted, id),

  isContextIsolated: async () => true, // TODO
  isDebugEnabled: async () => true, // TODO

  requestDataPreview: () => ipcRenderer.invoke(EventType.DataPreviewRequested),
  requestMetaFormats: () => ipcRenderer.invoke(EventType.MetaFormatsRequested),
  requestMetaFormatList: () => ipcRenderer.invoke(EventType.MetaFormatListRequested),
  listenDataChanged: (dataChangedCallback) => ipcRenderer.on(EventType.DataChanged, dataChangedCallback)
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
