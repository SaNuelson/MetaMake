import { BrowserWindow, dialog } from "electron";
import DataManager from "../DataManager";

export async function loadLocalFile(window: BrowserWindow): Promise<boolean> {
  const res = await dialog.showOpenDialog(window, {
    title: "Load data file",
    filters: [{name: "Tabular data", extensions: ['csv', 'xml', 'xslt']}],
    properties: ['openFile']
  });

  if (res.canceled)
    return false;

  if (res.filePaths.length !== 1) {
    console.log(`Load data expects exactly 1 file, ${res.filePaths} received.`);
    return false;
  }

  return await DataManager.loadData(res.filePaths[0]);
}
