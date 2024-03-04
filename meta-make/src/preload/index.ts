import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from "@electron-toolkit/preload";
import { EventType } from "../common/constants";
import { DataInfo } from "../common/type";
import { api } from "./api";

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
