import { ipcRenderer } from "electron";
import { EventType } from "../common/constants";
import { DataInfo } from "../common/type";

export type StringHandlingCallback = (value: string) => void;
export type EmptyCallback = () => void;

export interface MetaMakeAPI {
  requestDataPreview: () => Promise<DataInfo | null>,
  requestMetaFormatList: () => Promise<string[]>,
  listenDataChanged: (dataChangedCallback: EmptyCallback) => void
}

// Custom APIs for renderer
export const api: MetaMakeAPI = {
  requestDataPreview: () => ipcRenderer.invoke(EventType.DataPreviewRequested),
  requestMetaFormatList: () => ipcRenderer.invoke(EventType.MetaFormatListRequested),
  listenDataChanged: (dataChangedCallback) => ipcRenderer.on(EventType.DataChanged, dataChangedCallback)
}
