import { EventType } from '../common/constants'
import DataManager from './data/DataManager'
import { BrowserWindow, ipcMain, IpcMainInvokeEvent, IpcRendererEvent } from 'electron'
import KnowledgeBaseManager from './kb/KnowledgeBaseManager'
import { KnowledgeBase } from "../common/dto/KnowledgeBase";
import Restructurable from "../common/dto/Restructurable";
import {loadLocalDataFile, saveMetaModelFile} from "./commands/storage";
import generateMetadata from "./processing/generator";
import MetaBaseManager from "./kb/MetaBaseManager";
import metaBaseManager from "./kb/MetaBaseManager";

type MainElectronEventHandler = (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any
type RendererElectronEventHandler = (event: IpcRendererEvent, ...args: any[]) => (Promise<any>) | (any);

const logLevel = 1;

// HANDLING: RENDERER -> MAIN
export const indexMainEventHandlers: { [type in EventType]?: MainElectronEventHandler} = {
  // region GET STATE
  [EventType.CheckDataProcessed]: () => MetaBaseManager.processed,
  // endregion

  //region GET DATA
  [EventType.LoadDataModalRequested]: () => loadLocalDataFile(BrowserWindow.getFocusedWindow()!),
  [EventType.DataPreviewRequested]: () => DataManager.dataSource?.getPreview(),

  [EventType.MetaFormatListRequested]: () => KnowledgeBaseManager.getMetaFormatList(),
  [EventType.MetaFormatsRequested]: () => KnowledgeBaseManager.metaFormats,

  [EventType.KnowledgeBaseListRequested]: (_, formatName?: string) => KnowledgeBaseManager.getKnowledgeBaseList(formatName),
  [EventType.KnowledgeBaseRequested]: (_, id: string) => KnowledgeBaseManager.getKnowledgeBase(id),

  [EventType.MetaBaseRequested]: () => MetaBaseManager.metaBase,
  //endregion

  //region SET
  [EventType.KnowledgeBaseUpdated]: (_, kb: KnowledgeBase) => KnowledgeBaseManager.setKnowledgeBase(kb),
  [EventType.KnowledgeBaseDeleted]: (_, kbId: string) => KnowledgeBaseManager.deleteKnowledgeBase(kbId),
  [EventType.SaveMetaModelRequested]: (_, model) => saveMetaModelFile(BrowserWindow.getFocusedWindow()!, model),
  //endregion

  //region CALL
  [EventType.DataProcessingRequested]: (_, formatName: string, kbId?: string) => {
    if (kbId)
      return metaBaseManager.fromKnowledgeBase(KnowledgeBaseManager.getKnowledgeBase(kbId)!)
    return metaBaseManager.fromMetaFormat(KnowledgeBaseManager.getMetaFormat(formatName)!)
  },
  //endregion
};

Object.entries(indexMainEventHandlers).forEach(([key, handler]) => {
  indexMainEventHandlers[key] = function (event: Electron.IpcMainInvokeEvent, ...rawArgs: any[]) {
    const args: any[] = rawArgs.map((rawArg) => Restructurable.restructure(rawArg))
    return handler(event, ...args)
  }
})


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
}
