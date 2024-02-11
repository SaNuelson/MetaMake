import { BrowserWindow, Menu } from "electron";

export function createMainNavigation(window: BrowserWindow): Electron.Menu {
  return Menu.buildFromTemplate([
    {
      label: "Data",
      submenu: [
        {
          click: () => window.webContents.send("request-load-data"),
          label: "Load data..."
        },
        {
          click: () => window.webContents.send("request-load-meta" ),
          label: "Load meta..."
        }
      ]
    },
    {
      label: "Knowledge base",
      submenu: [
        {
          click: () => window.webContents.send("request-load-data"),
          label: "New knowledge base..."
        },
        {
          click: () => window.webContents.send("request-load-meta" ),
          label: "Load knowledge base..."
        },
        {
          click: () => window.webContents.send("request-load-meta" ),
          label: "Manage knowledge bases"
        }
      ]
    }
  ]);
}
