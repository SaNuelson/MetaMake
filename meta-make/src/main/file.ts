import DataManager from "./data/DataManager";
import { ipcMain } from "electron";

type DataLoadedCallback = (data: string) => void;

export function loadData(path: string) {
  let dm = new DataManager(path);

}
