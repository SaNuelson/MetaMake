import { EventType } from '../common/constants'
import DataManager from './data/DataManager'
import { BrowserWindow, ipcMain, IpcMainInvokeEvent, IpcRendererEvent } from 'electron'
import KnowledgeBaseManager from './kb/KnowledgeBaseManager'

type MainElectronEventHandler = (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<any>) | (any);
type RendererElectronEventHandler = (event: IpcRendererEvent, ...args: any[]) => (Promise<any>) | (any);

const logLevel = 1;

// HANDLING: RENDERER -> MAIN
export const indexMainEventHandlers: { [type in EventType]?: MainElectronEventHandler} = {
  [EventType.DataPreviewRequested]: () => DataManager.dataSource?.getPreview(),
  [EventType.MetaFormatListRequested]: () => KnowledgeBaseManager.getMetaFormatList()
};


// EMITTING: MAIN -> RENDERER
export const indexRendererEventHandlers: { [type in EventType]?: RendererElectronEventHandler} = {

}

export function broadcastToWindows(eventType: string, ...args: any[]) {
  if (logLevel > 0) {
    console.log(`Broadcast MAIN -> WINDOWs (${eventType})`);
  }
  BrowserWindow.getAllWindows().forEach(window => window.webContents.send(eventType, ...args));
}

export function attachIndexEventHandlers() {
  Object.entries(indexMainEventHandlers)
    .forEach(([type, callback]) => {
      if (logLevel <= 0) {
        ipcMain.handle(type, callback);
        return;
      }

      const wrapped: MainElectronEventHandler = function(ev: IpcMainInvokeEvent, ...args: any[]) {
        console.log(`Event(${type}${args.length ? ", " + args.join(", ") : ""})::handle`);
        return callback(ev, ...args);
      }
      ipcMain.handle(type, wrapped);
    });

  Object.entries(indexRendererEventHandlers)
    .forEach(([type, callback]) => {
    })
}
