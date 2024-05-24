import { app, BrowserWindow, globalShortcut, Menu } from "electron";
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createIndexWindow } from './windows'
import InitDtos from './dto/Init'
import MetaStore from "./data/MetaStore";
import { Config, LogLevel } from "../common/constants";
import { attachIndexEventHandlers } from "./events";
import { createMainNavigation } from "./menu";
import KnowledgeBaseManager from './manager/KnowledgeBaseManager.js'
import PipelineManager from './manager/PipelineManager.js'

app.whenReady().then(async () => {

  InitDtos()
  KnowledgeBaseManager.init();
  PipelineManager.init()

  electronApp.setAppUserModelId('com.electron.metamake')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

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
