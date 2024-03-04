import { BrowserWindow, dialog } from 'electron'
import DataManager from '../data/DataManager'

export async function selectFilesDialog(window: BrowserWindow, options: Electron.OpenDialogOptions = {}): Promise<string[]> {
  const res = await dialog.showOpenDialog(window, options)

  if (res.canceled) {
    throw new Error('User canceled operation.')
  }

  if (res.filePaths.length !== 1) {
    throw new Error(`Load data expects exactly 1 file, ${res.filePaths} received.`)
  }

  return res.filePaths;
}

export async function loadLocalDataFile(window: BrowserWindow): Promise<boolean> {
  const paths = await selectFilesDialog(window, {
    title: 'Load data file',
    filters: [{ name: 'Tabular data', extensions: ['csv', 'xml', 'xslt'] }],
    properties: ['openFile'],
  });
  return await DataManager.loadData(paths[0]);
}

export async function loadLocalKBFile(window: BrowserWindow): Promise<boolean> {
  const paths = await selectFilesDialog(window, {
    title: 'Load data file',
    filters: [{ name: 'Knowledge base', extensions: ['knob'] }],
    properties: ['openFile', "multiSelections"],
  });
  return await DataManager.loadData(paths[0]);
}
