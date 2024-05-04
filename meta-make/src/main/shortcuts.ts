import { BrowserWindow } from "electron";
import { createKnowledgeBaseWindow } from "./windows";
import { loadLocalDataFile } from "./commands/storage";
import { parseMetaUrl } from "../common/utils/url";
import { MetaUrl } from "../common/constants";

export function handleShortcut(window: BrowserWindow, input: Electron.Input): boolean {
  const url = window.webContents.getURL();
  const [metaUrl, ...args] = parseMetaUrl(url);

  switch(metaUrl) {
    case MetaUrl.Index:
      return handleIndexShortcut(window, input);
    case MetaUrl.KnowledgeBase:
      return handleKBManagerShortcut(window, input);
    case MetaUrl.KnowledgeBaseCreate:
      return handleKBEditorShortcut(window, input);
    default:
      return false;
  }

}

function handleIndexShortcut(window: BrowserWindow, input: Electron.Input): boolean {

  // CTRL+K: Open KB Manager
  if (input.control && input.key.toLowerCase() === 'k') {
    createKnowledgeBaseWindow(window);
    return true;
  }

  // CTRL+O: Open data file input
  if (input.control && input.key.toLowerCase() === 'o') {
    loadLocalDataFile(window);
    return true;
  }

}
function handleKBManagerShortcut(window: BrowserWindow, input: Electron.Input): boolean {
  // ESC: Close window
  if (input.key.toLowerCase() == 'escape') {
    window.close()
  }
}
function handleKBEditorShortcut(window: BrowserWindow, input: Electron.Input): boolean {

}
