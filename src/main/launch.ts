import { Launch, LaunchOpts } from 'xlicore'
import { LauncherParams } from './types.js'
import { gamePath, renderer } from './index.js'

export function startGame(params: LauncherParams) {
  const launchOpts: LaunchOpts = {
    auth: params.launchCredentials,
    useAuthlib: true,
    rootDir: gamePath,
    version: '1.21.1',
    gameOpts: {
      memory: {
        min: params.launchOpts.memory.min,
        max: params.launchOpts.memory.max
      },
      screen: {
        width: params.launchOpts.screen.width,
        height: params.launchOpts.screen.height
      }
    },
    callbacks: {
      dlOnProgress(progress, _chunk, file, _lastProgress) {
        renderer.send('progress', { type: file.type, percent: (progress.percent*100).toFixed(2) })
      },
      gameOnStart() {
        console.log(`MC started`)
        renderer.send('start')
      },
      gameOnExit() {
        console.log(`MC closed`)
        renderer.send('close')
      },
      gameOnError(err) {
          renderer.send('feed-push', {
            title: 'Ошибка!',
            description: `${err.message.toString()}\n\nЭта ошибка может быть не критичной, но пожалуйста, сообщите нам о ней!\nЕсли Minecraft долго не запускается - перезапустите лаунчер.`
          })
          console.log(`Error: ${err}`)
      },
    },
    mrpack: {
      url: 'https://cdn.modrinth.com/data/paoFU4Vl/versions/lTRTUeLo/Additive-1.32.0%2B1.21.1.fabric.mrpack',
      verify: {
        hash: 'ff68c4be7942064dbe378701bb50960284059c9f',
        algorithm: 'sha1'
      }
    }
  }
  const launch = new Launch(launchOpts)
  launch.start()
}
