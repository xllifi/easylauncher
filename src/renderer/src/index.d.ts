import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  let electron: ElectronAPI
  let api: unknown
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}
