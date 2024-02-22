import { EventType } from "../common/constants";
import DataManager from "./DataManager";
import { BrowserWindow, ipcMain, IpcMainInvokeEvent, ipcRenderer, IpcRendererEvent } from "electron";

type MainElectronEventHandler = (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<any>) | (any);
type RendererElectronEventHandler = (event: IpcRendererEvent, ...args: any[]) => (Promise<any>) | (any);

// HANDLING: RENDERER -> MAIN
export const mainEventHandlers: { [type in EventType]?: MainElectronEventHandler} = {
  [EventType.DataPreviewRequested]: () => DataManager.dataSource?.getPreview()
};


// EMITTING: MAIN -> RENDERER
export const rendererEventHandlers: { [type in EventType]?: RendererElectronEventHandler} = {

}

export function broadcastToWindows(eventType: string, ...args: any[]) {
  // TODO: Log
  BrowserWindow.getAllWindows().forEach(window => window.webContents.send(eventType, ...args));
}

export function attachEventHandlers(log: boolean) {
  Object.entries(mainEventHandlers)
    .forEach(([type, callback]) => {
      if (!log) {
        ipcMain.handle(type, callback);
        return;
      }

      const wrapped: MainElectronEventHandler = function(ev: IpcMainInvokeEvent, ...args: any[]) {
        console.log(`Event(${type}${args.length ? ", " + args.join(", ") : ""})::handle`);
        return callback(ev, ...args);
      }
      ipcMain.handle(type, wrapped);
    });

  Object.entries(rendererEventHandlers)
    .forEach(([type, callback]) => {
      if (!log) {

      }
    })
}
