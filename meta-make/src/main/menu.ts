import { BrowserWindow, Menu, shell } from "electron";
import { loadLocalDataFile } from './commands/storage'
import { createKnowledgeBaseEditorWindow, createKnowledgeBaseWindow, createPipelineManagerWindow } from './windows'
import knowledgeBaseManager from "./manager/KnowledgeBaseManager";
import MetaStore from "./data/MetaStore";
import { Config } from "../common/constants";
import { existsSync, rmSync } from "fs";

export function createMainNavigation(window: BrowserWindow): Electron.Menu {
  return Menu.buildFromTemplate([
    {
      label: 'Data',
      submenu: [
        {
          label: 'Load data...',
          click: () => loadLocalDataFile(window)
        },
        {
          label: 'Load meta...',
          enabled: false,
          click: () => {}
        }
      ]
    },
    {
      label: 'Knowledge base',
      submenu: [
        {
          label: 'New knowledge base...',
          click: () => createKnowledgeBaseEditorWindow(window)
        },
        {
          label: 'Load knowledge base...',
          enabled: false,
          click: () => {}
        },
        {
          label: 'Manage knowledge bases',
          click: () => createKnowledgeBaseWindow(window)
        }
      ]
    },
    {
      label: 'Pipeline',
      submenu: [
        {
          label: 'Manage pipelines',
          click: () => createPipelineManagerWindow(window)
        }
      ]
    },
    {
      label: 'Options',
      submenu: [
        {
          label: 'Preferences',
          enabled: false,
          click: () => {}
        }
      ]
    },
    {
      label: 'Debug',
      submenu: [
        {
          label: 'Reset',
          click: () => {
            MetaStore.reset();
            knowledgeBaseManager.getKnowledgeBaseList().forEach(kbi => knowledgeBaseManager.deleteKnowledgeBase(kbi.id));
            if (existsSync(MetaStore.get(Config.kbPath)))
              rmSync(MetaStore.get(Config.kbPath), {recursive: true});
          }
        }
      ]
    },
    {
      label: 'About',
      submenu: [
        {
          label: 'Help',
          enabled: false,
          click: () => {}
        },
        {
          label: 'Github',
          click: () => {shell.openExternal('https://github.com/SaNuelson/MetaMake')}
        },
        {
          label: 'Copyright',
          enabled: false,
          click: () => {}
        }
      ]
    }
  ])
}
