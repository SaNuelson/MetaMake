import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { MetaUrl } from '../common/constants'
import { handleShortcut } from './shortcuts'
import { createMetaUrl } from '../common/utils/url'

type WindowOptions = {
  parent?: BrowserWindow
  slug?: string
}

export function createWindow({ parent, slug }: WindowOptions): BrowserWindow {
  const window = new BrowserWindow({
    parent: parent,
    modal: !!parent,

    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true
    }
  })

  if (parent) {
    let pPos = parent.getPosition()
    window.setPosition(pPos[0] + 40, pPos[1] + 40)
  }

  window.webContents.on('before-input-event', (event, input) => {
    const shouldPreventDefault = handleShortcut(window, input)
    if (shouldPreventDefault) event.preventDefault()
  })

  window.on('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  slug ??= ''
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'] + slug)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html' + slug))
  }

  return window
}

export function createIndexWindow(): BrowserWindow {
  return createWindow({})
}

export function createKnowledgeBaseWindow(parent?: BrowserWindow) {
  return createWindow({ parent, slug: createMetaUrl(MetaUrl.KnowledgeBase) })
}

export function createKnowledgeBaseEditorWindow(parent?: BrowserWindow, kbId?: string) {
  return createWindow({ parent, slug: createMetaUrl(!!kbId ? MetaUrl.KnowledgeBase : MetaUrl.KnowledgeBaseCreate, kbId!)})
}
