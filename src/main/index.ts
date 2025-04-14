import { app, shell, BrowserWindow, ipcMain, WebContents, Tray } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { startGame } from './launch.js'
import { DraslAuth, launchCredentials, genDirs, DraslRefreshRequest } from 'xlicore'
import * as Sentry from '@sentry/electron/main'
import { existsSync } from 'fs'
import { Updater } from './updater.js'
import { ChildProcess, exec } from 'child_process'
import { TimeoutError } from 'ky'
import * as fsp from 'fs/promises'

const updater = new Updater()
const isDev = !app.isPackaged

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_URL,
  environment: isDev ? 'development' : 'production'
})
Sentry.setExtra('source', 'BACKEND')

export const gamePath = path.resolve(app.getPath('home'), '.easylauncher')
export let loadingWindow: BrowserWindow, mainWindow: BrowserWindow, renderer: WebContents
const drasl = new DraslAuth({
  server: import.meta.env.VITE_AUTH_HOST,
  saveDir: path.resolve(gamePath, 'instance')
})

function createWindow(): void {
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
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  genDirs(gamePath)
  // Set app user model id for windows
  electronApp.setAppUserModelId('ru.xllifi.launcher')
  await updater.checkForUpdates()

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

ipcMain.on('launch', async (_event, shared) => {
  try {
    const process = await startGame(shared)

    if (process) processes.push(process)
  } catch (err: any) {
    renderer.send('launch-cancelled')

    if (err instanceof Object) {
      switch (err.constructor.name) {
        case 'AggregateError': {
          Sentry.captureException(err)
          let feedId = 'launch-error-unknown'
          if (err.errors.filter((err) => !(err instanceof TimeoutError)).length <= 0) {
            feedId = 'generic-error-timeout'
          }
          renderer.send('feed-push', {
            id: feedId,
            verbose: JSON.stringify(
              {
                cause: err.cause,
                message: err.message,
                name: err.name,
                errors: err.errors.map((x) => ({
                  cause: x.cause,
                  message: x.message,
                  name: x.name
                }))
              },
              null,
              2
            )
          })
          return
        }
        case 'TimeoutError': {
          Sentry.captureException(err)
          renderer.send('feed-push', {
            id: 'generic-error-timeout',
            verbose: JSON.stringify(
              {
                cause: err.cause,
                message: err.message,
                name: err.name
              },
              null,
              2
            )
          })
          return
        }
        case 'MrpackParseError': {
          if (err.reason === 'files_locked') {
            renderer.send('feed-push', { id: 'launch-error-modslocked' })
            return
          }
        }
        case 'Error': {
          switch (err.cause) {
            case 'lm_missing_whole': {
              Sentry.captureException(err)
              renderer.send('feed-push', { id: 'launch-error-launchermeta-missing-whole' })
              return
            }
            case 'lm_missing_version': {
              Sentry.captureException(err)
              renderer.send('feed-push', { id: 'launch-error-launchermeta-missing-version' })
              return
            }
            default: {
              break
            }
          }
        }
        default: {
          break
        }
      }
    }

    Sentry.captureException(err)
    renderer.send('feed-push', {
      id: 'launch-error-unknown',
      verbose: JSON.stringify(
        {
          cause: err.cause,
          message: err.message,
          name: err.name
        },
        null,
        2
      )
    })
  }
})
ipcMain.on('stopgame', () => {
  processes.forEach((x) => x.kill())
})

ipcMain.on('installupdate', () => {
  updater.installUpdate().catch((err: Error) => {
    Sentry.captureException(err)
    renderer.send('cancelupdate')

    if (err.cause == 'noupdate') {
      renderer.send('feed-push', { id: 'update-error-noupdate' })
      return
    }
    if (err.cause == 'nofile') {
      renderer.send('feed-push', { id: 'update-error-nofile' })
      return
    }
    renderer.send('feed-push', {
      id: 'update-error-unknown',
      verbose: JSON.stringify(
        {
          cause: err.cause,
          message: err.message,
          name: err.name
        },
        null,
        2
      )
    })
  })
})

ipcMain.on('login-request', async (_event, creds: { username: string; password: string }) => {
  const resp = await drasl.first(creds).catch((err) => {
    Sentry.captureException(err)
    renderer.send('login-response', { isError: true })
    if (err.response && err.response.status == 401) {
      return renderer.send('feed-push', { id: 'login-error-401' })
    }
    renderer.send('feed-push', {
      id: 'login-error-unknown',
      verbose: JSON.stringify(
        {
          cause: err.cause,
          message: err.message,
          name: err.name
        },
        null,
        2
      )
    })
  })
  if (!resp) {
    return
  }

  const launchCredentials: launchCredentials = {
    accessToken: resp.accessToken,
    clientId: resp.clientToken,
    name: resp.availableProfiles[0].name,
    uuid: resp.availableProfiles[0].id,
    userType: 'mojang',
    drasl: { server: drasl.authserver }
  }
  renderer.send('login-response', { launchCredentials, isError: false })
})

ipcMain.on('refresh-request', async (_event, body: DraslRefreshRequest) => {
  const resp = await drasl.refresh(body).catch((err) => {
    Sentry.captureException(err)
    renderer.send('refresh-response', { isError: true })
    if (err.response && err.response.status == 401) {
      return renderer.send('feed-push', { id: 'login-error-401' })
    }
    renderer.send('feed-push', {
      id: 'login-error-unknown',
      verbose: JSON.stringify(
        {
          cause: err.cause,
          message: err.message,
          name: err.name
        },
        null,
        2
      )
    })
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
  renderer.send('refresh-response', { launchCredentials, isError: false })
})

ipcMain.on('reset-mc-paths', async (_e, resets: Array<'assets' | 'instance' | 'java' | 'libraries' | 'version' | 'everything'>) => {
  try {
    if (resets.includes('everything')) {
      await fsp.rm(gamePath, { recursive: true })
      renderer.send('feed-push', { id: 'reset-everything' })
      return
    }
    resets.forEach((x) => {
      fsp.rm(path.resolve(gamePath, x), { recursive: true })
      renderer.send('feed-push', { id: `reset-${x}` })
    })
  } catch (err) {
    Sentry.captureException(err)
    if (err instanceof Error) {
      renderer.send('feed-push', {
        id: 'reset-error-unknown',
        verbose: JSON.stringify(
          {
            cause: err.cause,
            message: err.message,
            name: err.name
          },
          null,
          2
        )
      })
    }
  }
})

ipcMain.on('capture-feedback', (_event, {input}) => {
  Sentry.captureMessage("[BE] " + input)
})

if (!process.windowsStore) {
  try {
    exec(`powershell (Get-AppxPackage -Name EasyLauncher).PackageFullName`, (_error, stdout, _stderr) => {
      if (!stdout) {
        return
      }
      console.log(`Removing APPX package '${stdout.trim()}'...`)
      exec(`powershell Remove-AppxPackage -Package '${stdout.trim()}'`)
    })
  } catch (e) {
    Sentry.captureException(e)
  }
}
