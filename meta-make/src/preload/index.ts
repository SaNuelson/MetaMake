import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from "@electron-toolkit/preload";
import { EventType } from "../common/constants";
import { DataInfo } from "../common/type";

type StringHandlingCallback = (value: string) => void;
type EmptyCallback = () => void;

export interface MetaMakeAPI {
  requestDataPreview: () => Promise<DataInfo | null>,
  requestMetaFormatList: () => Promise<string[]>,
  listenDataChanged: (dataChangedCallback: EmptyCallback) => void
}

// Custom APIs for renderer
let api: MetaMakeAPI = {
  requestDataPreview: () => ipcRenderer.invoke(EventType.DataPreviewRequested),
  requestMetaFormatList: () => ipcRenderer.invoke(EventType.MetaFormatListRequested),
  listenDataChanged: (dataChangedCallback) => ipcRenderer.on(EventType.DataChanged, dataChangedCallback)
}

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
