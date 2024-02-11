import { ElectronAPI } from "@electron-toolkit/preload";
import { MetaMakeAPI } from "../preload";

declare global {
  interface Window {
    electron: ElectronAPI
    api: MetaMakeAPI
  }

  interface Test123 {
    test: number
  }
}
