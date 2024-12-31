import { app, shell, BrowserWindow, ipcMain, WebContents } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { startGame } from './launch.js'
import { DraslAuth, launchCredentials, genDirs } from 'xlicore'

const isDev = !app.isPackaged

export const gamePath = path.resolve(app.getPath('appData'), '.easylauncher')
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
    title: 'easylauncher',
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
    console.log(process.env['ELECTRON_RENDERER_URL'])
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

ipcMain.on('report', () => {
  shell.openExternal('https://t.me/xllifi')
})
ipcMain.on('minimize', () => {
  mainWindow.minimize()
})
ipcMain.on('quit', () => {
  mainWindow.destroy()
})

ipcMain.on('launch', (_event, { params }) => {
  startGame(params)
})

ipcMain.on('loginrequest', async (_event, { username, password }) => {
  console.log(`auth with: ${username}; ${password}`)
  const drasl = new DraslAuth({
    username,
    password,
    server: 'https://testauth.xllifi.ru',
    saveDir: path.resolve(gamePath, 'instance')
  })

  console.log(`sending to drasl module`)
  const resp = await drasl.first()
  .catch((err) => {
    console.log(`drasl errored!`)
    renderer.send('loginresponse', { launchCredentials: {} })
    if (err.response && err.response.status == 401) {
      console.log(`drasl 401!`)
      return renderer.send('feed-push', { title: `Не удалось войти!`, description: `Похоже, что вы ввели неверные данные. \nКод ошибки: ${err.response.status}` })
    }
    console.log(`drasl unknown err!`)
    renderer.send('feed-push', { title: `Не удалось войти!`, description: `Полная причина: ${err}` })
  })
  if (!resp) {
    console.log(`drasl no resp!`)
    return
  }

  console.log(`drasl finished, sending creds!`)
  const launchCredentials: launchCredentials = {
    accessToken: resp.accessToken,
    clientId: resp.clientToken,
    name: resp.selectedProfile.name,
    uuid: resp.selectedProfile.id,
    userType: 'mojang',
    drasl: { server: drasl.authserver }
  }
  console.log(JSON.stringify(launchCredentials))
  renderer.send('feed-push', { title: `Вы успешно вошли`, description: `Ваш никнейм - ${launchCredentials.name}` })
  renderer.send('loginresponse', { launchCredentials })
})
