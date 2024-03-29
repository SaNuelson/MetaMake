import { ElectronAPI } from '@electron-toolkit/preload'
import { MetaMakeAPI } from '../preload'

declare global {
  interface Window {
    electron: ElectronAPI
    rawApi: MetaMakeAPI
    api: MetaMakeAPI
  }

  interface Test123 {
    test: number
  }
}
