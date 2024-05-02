import { app, BrowserWindow, globalShortcut } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createIndexWindow } from './windows'
import initShortcuts from './shortcuts'
import InitDtos from './dto/Init'
import ElectronStore from 'electron-store'
import path from 'node:path'
import { existsSync, mkdirSync } from 'fs'
import knowledgeBaseManager from "./kb/KnowledgeBaseManager";

function initStore() {
  const store = new ElectronStore()

  const kbPath = path.join(app.getPath('userData'), 'kb/');

  if (!existsSync(kbPath))
    mkdirSync(kbPath)

  store.set('kbPath', kbPath);


}

app.whenReady().then(() => {
  InitDtos()
  initStore()
  knowledgeBaseManager.init().then(() => console.log("KBMan.init() complete."))

  electronApp.setAppUserModelId('com.electron.metamake')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createIndexWindow()


  // shortcuts
  initShortcuts(mainWindow)

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
