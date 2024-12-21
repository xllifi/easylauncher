import { Launch, LaunchOpts } from 'xlicore'
import { LauncherParams } from './types.js'
import { gamePath, mainWindow } from './index.js'

export function startGame(params: LauncherParams) {
  const ipc = mainWindow.webContents

  const launchOpts: LaunchOpts = {
    auth: params.username,
    authserver: '',
    rootDir: gamePath,
    version: '1.21.1',
    verify: true,
    fabric: {
      version: null
    },
    gameOpts: {
      memory: {
        min: params.launchParams.minMem,
        max: params.launchParams.maxMem
      }
    },
    callbacks: {
      dlOnProgress(progress, _chunk, file, _lastProgress) {
        ipc.send('progress', { type: file.type, percent: (progress.percent*100).toFixed(2) })
      },
      gameOnStart() {
        console.log(`MC started`)
        ipc.send('start')
      },
      gameOnExit() {
        console.log(`MC closed`)
        ipc.send('close')
      },
      gameOnError(err) {
          ipc.send('feed-push', {
            title: 'Ошибка!',
            description: `${err.message.toString()}\n\nЭта ошибка может быть не критичной, но пожалуйста, сообщите нам о ней!\nЕсли Minecraft долго не запускается - перезапустите лаунчер.`
          })
          console.log(`Error: ${err}`)
      },
    }
  }
  const launch = new Launch(launchOpts)
  launch.start()
}
