import { BrowserWindow, Menu, dialog } from "electron";
import DataManager from "./data/DataManager";
import { loadLocalDataFile } from "./commands/storage";
import { createKnowledgeBaseWindow } from "./windows";

export function createMainNavigation(window: BrowserWindow): Electron.Menu {
  return Menu.buildFromTemplate([
    {
      label: "Data",
      submenu: [
        {
          label: "Load data...",
          click: () => loadLocalDataFile(window)
        },
        {
          label: "Load meta...",
          click: () => {}
        }
      ]
    },
    {
      label: "Knowledge base",
      submenu: [
        {
          label: "New knowledge base...",
          click: () => {}
        },
        {
          label: "Load knowledge base...",
          click: () => {}
        },
        {
          label: "Manage knowledge bases",
          click: () => createKnowledgeBaseWindow(window)
        }
      ]
    },
    {
      label: "Options",
      submenu: [
        {
          label: "Preferences",
          click: () => {}
        }
      ]
    },
    {
      label: "About",
      submenu: [
        {
          label: "Help",
          click: () => {}
        },
        {
          label: "Github",
          click: () => {}
        },
        {
          label: "Copyright",
          click: () => {}
        }
      ]
    }
  ]);
}
