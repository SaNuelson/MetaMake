import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import DataInfo from '../common/dto/DataInfo'
import { EventType } from '../common/constants'
import MetaFormat from '../common/dto/MetaFormat'
import { KnowledgeBase, KnowledgeBaseInfo } from '../common/dto/KnowledgeBase'
import { MetaBase } from "../common/dto/MetaModelSource";

export type StringHandlingCallback = (value: string) => void
export type EmptyCallback = () => void

export interface MetaMakeAPI {
  // region GET STATE
  checkDataProcessed: () => Promise<boolean>
  // endregion

  //region GET DATA
  requestDataPreview: () => Promise<DataInfo>
  requestMetaFormatList: () => Promise<string[]>
  requestMetaFormats: () => Promise<MetaFormat[]>
  requestKnowledgeBaseList: (formatName?: string) => Promise<KnowledgeBaseInfo[]>
  requestKnowledgeBase: (id: string) => Promise<KnowledgeBase>
  requestLoadDataModal: () => Promise<void>
  requestMetaBase: () => Promise<MetaBase>
  //endregion

  //region SET
  updateKnowledgeBase: (kb: KnowledgeBase) => Promise<string>
  deleteKnowledgeBase: (id: string) => Promise<void>
  //endregion

  //region CALL
  requestProcessing: (formatName: string, kbId?: string) => Promise<void>
  //endregion

  //region LISTEN
  //DataChanged = 'DataChanged',
  listenDataChanged: (dataChangedCallback: EmptyCallback) => void
  listenDataProcessed: (dataProcessedCallback: EmptyCallback) => void
  //endregion

  isContextIsolated: () => Promise<boolean>
  isDebugEnabled: () => Promise<boolean>



}

// Custom APIs for renderer
const api: MetaMakeAPI = {
  // region GET STATE
  checkDataProcessed: () => ipcRenderer.invoke(EventType.CheckDataProcessed),
  // endregion

  //region GET DATA
  requestDataPreview: () => ipcRenderer.invoke(EventType.DataPreviewRequested),
  requestMetaFormatList: () => ipcRenderer.invoke(EventType.MetaFormatListRequested),
  requestMetaFormats: () => ipcRenderer.invoke(EventType.MetaFormatsRequested),
  requestKnowledgeBaseList: (formatName?: string) => ipcRenderer.invoke(EventType.KnowledgeBaseListRequested, formatName),
  requestKnowledgeBase: (id: string) => ipcRenderer.invoke(EventType.KnowledgeBaseRequested, id),
  requestLoadDataModal: () => ipcRenderer.invoke(EventType.LoadDataModalRequested),
  requestMetaBase: () => ipcRenderer.invoke(EventType.MetaBaseRequested),
  //endregion

  //region SET
  updateKnowledgeBase: (kb: KnowledgeBase) => ipcRenderer.invoke(EventType.KnowledgeBaseUpdated, kb),
  deleteKnowledgeBase: (id: string) => ipcRenderer.invoke(EventType.KnowledgeBaseDeleted, id),
  //endregion

  //region CALL
  requestProcessing: (formatName: string, kbId?: string) => ipcRenderer.invoke(EventType.DataProcessingRequested, formatName, kbId),
  //endregion

  //region LISTEN
  //DataChanged = 'DataChanged',
  listenDataChanged: (dataChangedCallback) => ipcRenderer.on(EventType.DataChanged, dataChangedCallback),
  listenDataProcessed: (dataChangedCallback) => ipcRenderer.on(EventType.DataProcessed, dataChangedCallback),
  //endregion

  isContextIsolated: async () => true, // TODO
  isDebugEnabled: async () => true, // TODO
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
