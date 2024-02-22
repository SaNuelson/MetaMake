import { BrowserWindow, Menu, dialog } from "electron";
import DataManager from "./DataManager";
import { loadLocalFile } from "./commands/storage";

export function createMainNavigation(window: BrowserWindow): Electron.Menu {
  return Menu.buildFromTemplate([
    {
      label: "Data",
      submenu: [
        {
          click: () => loadLocalFile(window),
          label: "Load data..."
        },
        {
          click: () => {},
          label: "Load meta..."
        }
      ]
    },
    {
      label: "Knowledge base",
      submenu: [
        {
          click: () => {},
          label: "New knowledge base..."
        },
        {
          click: () => {},
          label: "Load knowledge base..."
        },
        {
          click: () => {},
          label: "Manage knowledge bases"
        }
      ]
    }
  ]);
}
