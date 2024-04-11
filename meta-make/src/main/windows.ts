import { BrowserWindow, Menu, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { createMainNavigation } from './menu'
import { attachIndexEventHandlers } from './events'
import { getMetaUrl, MetaUrl } from '../common/constants'
import { createMetaUrl, MetaUrl } from '../common/constants'

export function createIndexWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const mainMenu = createMainNavigation(mainWindow)
  Menu.setApplicationMenu(mainMenu)

  attachIndexEventHandlers()

  return mainWindow
}

export function createKnowledgeBaseWindow(parent?: BrowserWindow) {
  const kbWindow = new BrowserWindow({
    parent: parent,
    modal: !!parent,
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (parent) {
    let pPos = parent.getPosition()
    kbWindow.setPosition(pPos[0] + 40, pPos[1] + 40)
  }

  kbWindow.on('ready-to-show', () => {
    kbWindow.show()
  })

  kbWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log('ELECTRON_RENDERER_URL', process.env['ELECTRON_RENDERER_URL'])
    kbWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/kb')
  } else {
    kbWindow.loadFile(join(__dirname, '../renderer/index.html/kb'))
  }

  return kbWindow
}

export function createKnowledgeBaseEditorWindow(parent?: BrowserWindow, kbId?: string) {
  const kbWindow = new BrowserWindow({
    parent: parent,
    modal: !!parent,
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (parent) {
    let pPos = parent.getPosition()
    kbWindow.setPosition(pPos[0] + 40, pPos[1] + 40)
  }

  kbWindow.on('ready-to-show', () => {
    kbWindow.show()
  })

  kbWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const suffix = createMetaUrl(!!kbId ? MetaUrl.KnowledgeBase : MetaUrl.KnowledgeBaseCreate, kbId);

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log('ELECTRON_RENDERER_URL', process.env['ELECTRON_RENDERER_URL'])
    kbWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + suffix)
  } else {
    kbWindow.loadFile(join(__dirname, '../renderer/index.html' + suffix))
  }

  return kbWindow
}
