import { Launch, LaunchOpts } from 'xlicore'
import { SharedParams } from './types.js'
import { gamePath, renderer } from './index.js'
import { ChildProcessWithoutNullStreams } from 'child_process'

export async function startGame(shared: SharedParams): Promise<ChildProcessWithoutNullStreams> {
  let lastUpdateTimestamp: number = 0
  function sendProgress(type: string, percent: number) {
    if (lastUpdateTimestamp > Date.now()) return

    renderer.send('progress', { type, percent: (percent * 100).toFixed(2) })
    lastUpdateTimestamp = Date.now() + 250
  }

  let modpack: null | { url: string; verify?: { hash: string; algorithm: 'sha1' | 'sha256' } } = null
  switch (shared.modpackType) {
    case 'ess':
      modpack = null
      break
    case 'min':
      modpack = {
        url: 'https://files.xllifi.ru/modpacks/min.mrpack'
      }
      break
    case 'ful':
      modpack = {
        url: 'https://files.xllifi.ru/modpacks/ful.mrpack'
      }
      break
  }
  const launchOpts: LaunchOpts = {
    auth: shared.launchCredentials,
    useAuthlib: true,
    rootDir: gamePath,
    version: '1.21.1',
    gameOpts: {
      memory: {
        min: shared.launchOpts.memory.min,
        max: shared.launchOpts.memory.max
      },
      screen: {
        width: shared.launchOpts.screen.width,
        height: shared.launchOpts.screen.height
      },
      detached: shared.launchOpts.detached
    },
    callbacks: {
      dlOnProgress(progress, _chunk, file, _lastProgress) {
        sendProgress(file.type, progress.percent)
      },
      dlOnFinish(file, _lastProgress, percent) {
        if (!percent && percent != 0) return
        sendProgress(file.type, percent)
      },
      gameOnStart(pid) {
        console.log(`MC started`)
        renderer.send('start')
        renderer.send('addmcpid', { pid })
      },
      gameOnExit(pid) {
        console.log(`MC closed`)
        renderer.send('close')
        renderer.send('rmmcpid', { pid })
      },
      gameOnError(err) {
        renderer.send('feed-push', {
          id: 'game-error-unknown',
          additional: [err]
        })
        console.error(`Error: ${err}`)
      },
      gameOnLogs(data) {
        renderer.send('logs', { data })
      }
    }
  }
  if (modpack) launchOpts.mrpack = modpack

  const launch = new Launch(launchOpts)
  const process = await launch.start()
  return process
}
