import { app, BrowserWindow, globalShortcut } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { loadLocalDataFile } from './commands/storage'
import { createIndexWindow } from './windows'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createIndexWindow()

  // shortcuts
  const openDataShortcut = globalShortcut.register('CommandOrControl+O', () =>
    loadLocalDataFile(mainWindow)
  )

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
