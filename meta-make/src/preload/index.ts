import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from "@electron-toolkit/preload";
import { EventType } from "../common/constants";

type StringHandlingCallback = (value: string) => void;
type EmptyCallback = () => void;

export interface MetaMakeAPI {
  requestDataPreview: () => Promise<string[][]>,
  listenDataChanged: (dataChangedCallback: EmptyCallback) => void
}

// Custom APIs for renderer
let api: MetaMakeAPI = {
  requestDataPreview: () => ipcRenderer.invoke(EventType.DataPreviewRequested),
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
