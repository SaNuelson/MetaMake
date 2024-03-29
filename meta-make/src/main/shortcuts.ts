import { BrowserWindow, globalShortcut } from 'electron'
import { loadLocalDataFile } from './commands/storage'
import { createKnowledgeBaseWindow } from './windows'

export default function (mainWindow: BrowserWindow) {
  globalShortcut.register(
    'CommandOrControl+O',
    () => loadLocalDataFile(mainWindow)
    // TODO: Open KB / Meta based on current window context
  )

  globalShortcut.register('CommandOrControl+K', () => createKnowledgeBaseWindow(mainWindow))
}
