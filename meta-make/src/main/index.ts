import { app, BrowserWindow, globalShortcut, Menu } from "electron";
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createIndexWindow } from './windows'
import InitDtos from './dto/Init'
import path from 'node:path'
import { existsSync, mkdirSync } from 'fs'
import MetaStore from "./data/MetaStore";
import { Config } from "../common/constants";
import { session } from 'electron';
import * as os from "node:os";
import knowledgeBaseManager from "./kb/KnowledgeBaseManager";
import { attachIndexEventHandlers } from "./events";
import { createMainNavigation } from "./menu";

app.whenReady().then(async () => {
  InitDtos()

  const kbPath = path.join(app.getPath('userData'), 'kb/');
  if (!existsSync(kbPath))
    mkdirSync(kbPath)
  MetaStore.set(Config.kbPath, kbPath);

  console.log("KBIDs", MetaStore.getKnowledgeBases());
  knowledgeBaseManager.loadKBs()

  electronApp.setAppUserModelId('com.electron.metamake')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // TODO: Check if extension exists
  await session.defaultSession.loadExtension(path.join(
    os.homedir(),
    '/AppData/Local/Microsoft/Edge/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.1.0_0'
  ),
    { allowFileAccess: true })

  const mainWindow = createIndexWindow()

  const mainMenu = createMainNavigation(mainWindow)
  Menu.setApplicationMenu(mainMenu)
  attachIndexEventHandlers()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createIndexWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
