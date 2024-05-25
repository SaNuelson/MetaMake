import { BrowserWindow, dialog } from 'electron'
import DataManager from '../manager/DataManager.js'
import {writeTextToFile} from "../utils/io.js";
import MetaModel from "../../common/dto/MetaModel.js";
import { exportDCAT } from '../custom/format/fetchers/dcat.js'
import DcatApCz from '../custom/format/DcatApCz.js'

export async function selectFilesDialog(
  window: BrowserWindow,
  options: Electron.OpenDialogOptions = {}
): Promise<string[]> {
  const res = await dialog.showOpenDialog(window, options)

  if (res.canceled) {
    throw new Error('User canceled operation.')
  }

  if (res.filePaths.length !== 1) {
    throw new Error(`Load data expects exactly 1 file, ${res.filePaths} received.`)
  }

  return res.filePaths
}

export async function selectSaveFileDialog(
  window: BrowserWindow,
  options: Electron.SaveDialogOptions = {}
): Promise<string> {
  const res = await dialog.showSaveDialog(window, options)

  if (res.canceled) {
    throw new Error('User canceled operation.');
  }

  return res.filePath
}

export async function loadLocalDataFile(window: BrowserWindow): Promise<boolean> {
  try {
    const paths = await selectFilesDialog(window, {
      title: 'Load data file',
      filters: [{ name: 'Open data format', extensions: ['csv', 'xml', 'json', 'rdf'] }],
      properties: ['openFile'],
    });
    return await DataManager.loadData(paths[0]);
  }
  catch(e) {
    return false;
  }
}

export async function saveMetaModelFile(window: BrowserWindow, model: MetaModel) {
  try {
    const path = await selectSaveFileDialog(window, {
      title: 'Save MetaData File',
      defaultPath: `./${model.metaFormat.name}_exported.jsonld.txt`
    });
    // TODO:
    if (model.metaFormat.name === DcatApCz.name) {
      await writeTextToFile(path, await exportDCAT(model))
    }
  }
  catch (e: any) {
    console.error(`Failed to save model of ${model.metaFormat.name}: ${e.message}`);
  }

}

export async function loadLocalKBFile(window: BrowserWindow): Promise<boolean> {
  try {
    const paths = await selectFilesDialog(window, {
      title: 'Load data file',
      filters: [{ name: 'Knowledge base', extensions: ['knob'] }],
      properties: ['openFile', "multiSelections"],
    });
    return await DataManager.loadData(paths[0]);
  }
  catch(e) {
    return false;
  }
}
