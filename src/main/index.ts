import { app, shell, BrowserWindow, ipcMain, WebContents, Tray } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { startGame } from './launch.js'
import { DraslAuth, launchCredentials, genDirs, MrpackParseError } from 'xlicore'
import * as Sentry from '@sentry/electron/main'
import { existsSync } from 'fs'
import { Updater } from './updater.js'
import { ChildProcess } from 'child_process'
import { TimeoutError } from 'ky'

const updater = new Updater()
const isDev = !app.isPackaged

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_URL,
  environment: isDev ? 'development' : 'production'
})
Sentry.setExtra('source', 'BACKEND')

export const gamePath = path.resolve(app.getPath('home'), '.easylauncher')
export let loadingWindow: BrowserWindow, mainWindow: BrowserWindow, renderer: WebContents

function createWindow(): void {
  loadingWindow = new BrowserWindow({
    width: 600,
    height: 200,
    resizable: false,
    fullscreenable: false,
    show: true,
    transparent: true,
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    skipTaskbar: true
  })

  loadingWindow.on('system-context-menu', (event) => event.preventDefault())

  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 520,
    minHeight: 360,
    width: 600,
    height: 400,
    // resizable: false,
    // fullscreenable: false,
    show: false,
    titleBarStyle: 'hidden',
    title: 'EasyLauncher',
    autoHideMenuBar: true,
    fullscreenable: true,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      devTools: isDev ? true : false
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    loadingWindow.destroy()
    mainWindow.show()
  })

  mainWindow.on('system-context-menu', (event) => {
    event.preventDefault()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    loadingWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/splash')
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    loadingWindow.loadFile(join(__dirname, '../renderer/splash.html'))
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  genDirs(gamePath)
  // Set app user model id for windows
  electronApp.setAppUserModelId('ru.xllifi.launcher')
  updater.checkForUpdates()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  renderer = mainWindow.webContents

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  const tray = new Tray(icon)
  tray.setToolTip('easylauncher')
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (updater.updateFound) return
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const processes: ChildProcess[] = []

ipcMain.on('minimize', () => {
  mainWindow.minimize()
})
ipcMain.on('quit', () => {
  mainWindow.destroy()
})
ipcMain.on('viewlogs', () => {
  const logPath = path.resolve(gamePath, 'instance/logs/latest.log')
  if (!existsSync(logPath)) {
    renderer.send('feed-push', { id: 'nolog' })
    return
  }
  shell.openPath(logPath)
})
ipcMain.on('opengamedir', () => {
  const gameDir = path.resolve(gamePath, 'instance/')
  if (!existsSync(gameDir)) {
    renderer.send('feed-push', { id: 'nogamedir' })
    return
  }
  shell.openPath(gameDir)
})

ipcMain.on('launch', async (_event, { params }) => {
  const process = await startGame(params).catch((err) => {
    renderer.send('launch-cancelled')

    if (err instanceof TimeoutError) {
      renderer.send('feed-push', {
        id: 'launch-error-timeout',
        additional: [err]
      })
      return
    }
    if (err instanceof MrpackParseError && err.reason === 'files_locked') {
      renderer.send('feed-push', { id: 'launch-error-modslocked' })
      return
    }
    renderer.send('feed-push', {
      id: 'launch-error-unknown',
      additional: [err]
    })
    return
  })

  if (process) processes.push(process)
})
ipcMain.on('stopgame', () => {
  processes.forEach((x) => x.kill())
})

ipcMain.on('installupdate', () => {
  updater.installUpdate()
})

ipcMain.on('loginrequest', async (_event, { username, password }) => {
  const drasl = new DraslAuth({
    username,
    password,
    server: import.meta.env.VITE_AUTH_HOST,
    saveDir: path.resolve(gamePath, 'instance')
  })

  const resp = await drasl.first().catch((err) => {
    renderer.send('loginresponse', { launchCredentials: {} })
    if (err.response && err.response.status == 401) {
      return renderer.send('feed-push', { id: 'login-error-401' })
    }
    renderer.send('feed-push', { id: 'login-error-unknown', additional: [err] })
  })
  if (!resp) {
    return
  }

  const launchCredentials: launchCredentials = {
    accessToken: resp.accessToken,
    clientId: resp.clientToken,
    name: resp.selectedProfile.name,
    uuid: resp.selectedProfile.id,
    userType: 'mojang',
    drasl: { server: drasl.authserver }
  }
  renderer.send('feed-push', { id: 'login-success', additional: [launchCredentials.name] })
  renderer.send('loginresponse', { launchCredentials })
})
